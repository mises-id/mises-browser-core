/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_COMPONENTS_BRAVE_WALLET_BROWSER_KEYRING_SERVICE_H_
#define BRAVE_COMPONENTS_BRAVE_WALLET_BROWSER_KEYRING_SERVICE_H_

#include <memory>
#include <string>
#include <vector>

#include "base/gtest_prod_util.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/weak_ptr.h"
#include "base/values.h"
#include "mises/components/brave_wallet/browser/hd_keyring.h"
#include "mises/components/brave_wallet/browser/password_encryptor.h"
#include "mises/components/brave_wallet/common/brave_wallet.mojom-forward.h"
#include "mises/components/brave_wallet/common/brave_wallet.mojom.h"
#include "mises/components/brave_wallet/common/brave_wallet_types.h"
#include "components/keyed_service/core/keyed_service.h"
#include "mojo/public/cpp/bindings/pending_remote.h"
#include "mojo/public/cpp/bindings/receiver_set.h"
#include "mojo/public/cpp/bindings/remote_set.h"
#include <optional>

class PrefChangeRegistrar;
class PrefService;

namespace base {
class OneShotTimer;
}

namespace brave_wallet {

class EthTransaction;
class FilTransaction;
class KeyringServiceUnitTest;
class EthereumProviderImplUnitTest;
class SolanaProviderImplUnitTest;
class FilecoinKeyring;
class JsonRpcService;
class AssetDiscoveryManagerUnitTest;

// This class is not thread-safe and should have single owner
class KeyringService : public KeyedService, public mojom::KeyringService {
 public:
  KeyringService(JsonRpcService* json_rpc_service,
                 PrefService* profile_prefs,
                 PrefService* local_state);
  ~KeyringService() override;

  static std::optional<int>& GetPbkdf2IterationsForTesting();
  static void MigrateObsoleteProfilePrefs(PrefService* profile_prefs);

  static bool HasPrefForKeyring(const PrefService& profile_prefs,
                                const std::string& key,
                                const std::string& id);
  static const base::Value* GetPrefForKeyring(const PrefService& profile_prefs,
                                              const std::string& key,
                                              const std::string& id);
  // For testing only.
  static void SetPrefForKeyring(PrefService* profile_prefs,
                                const std::string& key,
                                const base::Value& value,
                                const std::string& id);
  static std::optional<std::vector<uint8_t>> GetPrefInBytesForKeyring(
      const PrefService& profile_prefs,
      const std::string& key,
      const std::string& id);
  static void SetPrefInBytesForKeyring(PrefService* profile_prefs,
                                       const std::string& key,
                                       base::span<const uint8_t> bytes,
                                       const std::string& id);

  static std::optional<std::string> GetKeyringIdForCoinNonFIL(
      mojom::CoinType coin);

  mojo::PendingRemote<mojom::KeyringService> MakeRemote();
  void Bind(mojo::PendingReceiver<mojom::KeyringService> receiver);

  // mojom::KeyringService
  // Must unlock before using this API otherwise it will return empty string
  void GetMnemonicForDefaultKeyring(
      const std::string& password,
      GetMnemonicForDefaultKeyringCallback callback) override;
  void MaybeCreateDefaultSolanaAccount();
  void CreateWallet(const std::string& password,
                    CreateWalletCallback callback) override;
  void RestoreWallet(const std::string& mnemonic,
                     const std::string& password,
                     bool is_legacy_brave_wallet,
                     RestoreWalletCallback callback) override;
  void Unlock(const std::string& password, UnlockCallback callback) override;
  void Lock() override;
  void IsLocked(IsLockedCallback callback) override;
  void AddAccount(const std::string& account_name,
                  mojom::CoinType coin,
                  AddAccountCallback callback) override;

  // Adds an account to the filecoin(keyring is choosed by network).
  void AddFilecoinAccount(const std::string& account_name,
                          const std::string& network,
                          AddAccountCallback callback) override;

  void EncodePrivateKeyForExport(
      const std::string& address,
      const std::string& password,
      mojom::CoinType coin,
      EncodePrivateKeyForExportCallback callback) override;
  void ImportAccount(const std::string& account_name,
                     const std::string& private_key,
                     mojom::CoinType coin,
                     ImportAccountCallback callback) override;
  void ImportAccountFromJson(const std::string& account_name,
                             const std::string& password,
                             const std::string& json,
                             ImportAccountCallback callback) override;
  void ImportFilecoinAccount(const std::string& account_name,
                             const std::string& private_key,
                             const std::string& network,
                             ImportFilecoinAccountCallback callback) override;
  void AddHardwareAccounts(
      std::vector<mojom::HardwareWalletAccountPtr> info) override;
  void RemoveHardwareAccount(const std::string& address,
                             mojom::CoinType coin,
                             RemoveHardwareAccountCallback callback) override;
  void RemoveImportedAccount(const std::string& address,
                             const std::string& password,
                             mojom::CoinType coin,
                             RemoveImportedAccountCallback callback) override;
  void IsWalletBackedUp(IsWalletBackedUpCallback callback) override;
  void NotifyWalletBackupComplete() override;
  void GetKeyringsInfo(const std::vector<std::string>& keyrings,
                       GetKeyringsInfoCallback callback) override;
  mojom::KeyringInfoPtr GetKeyringInfoSync(const std::string& keyring_id);
  void GetKeyringInfo(const std::string& keyring_id,
                      GetKeyringInfoCallback callback) override;
  void SetHardwareAccountName(const std::string& address,
                              const std::string& name,
                              mojom::CoinType coin,
                              SetHardwareAccountNameCallback callback) override;
  void SetKeyringDerivedAccountName(
      const std::string& keyring_id,
      const std::string& address,
      const std::string& name,
      SetKeyringDerivedAccountNameCallback callback) override;
  void SetKeyringImportedAccountName(
      const std::string& keyring_id,
      const std::string& address,
      const std::string& name,
      SetKeyringImportedAccountNameCallback callback) override;

  void Reset(bool notify_observer = true);
  bool IsKeyringCreated(const std::string& keyring_id) const;
  bool IsHardwareAccount(const std::string& keyring_id,
                         const std::string& account) const;
  void SignTransactionByDefaultKeyring(const std::string& address,
                                       EthTransaction* tx,
                                       uint256_t chain_id);
  std::optional<std::string> SignTransactionByFilecoinKeyring(
      FilTransaction* tx);

  struct SignatureWithError {
    SignatureWithError();
    SignatureWithError(SignatureWithError&& other);
    SignatureWithError& operator=(SignatureWithError&& other);
    SignatureWithError(const SignatureWithError&) = delete;
    SignatureWithError& operator=(const SignatureWithError&) = delete;
    ~SignatureWithError();

    std::optional<std::vector<uint8_t>> signature;
    std::string error_message;
  };
  SignatureWithError SignMessageByDefaultKeyring(
      const std::string& address,
      const std::vector<uint8_t>& message,
      bool is_eip712 = false);

  std::vector<uint8_t> SignMessage(const std::string& keyring_id,
                                   const std::string& address,
                                   const std::vector<uint8_t>& message);
  bool RecoverAddressByDefaultKeyring(const std::vector<uint8_t>& message,
                                      const std::vector<uint8_t>& signature,
                                      std::string* address);
  bool GetPublicKeyFromX25519_XSalsa20_Poly1305ByDefaultKeyring(
      const std::string& address,
      std::string* key);
  std::optional<std::vector<uint8_t>>
  DecryptCipherFromX25519_XSalsa20_Poly1305ByDefaultKeyring(
      const std::string& version,
      const std::vector<uint8_t>& nonce,
      const std::vector<uint8_t>& ephemeral_public_key,
      const std::vector<uint8_t>& ciphertext,
      const std::string& address);

  void AddAccountsWithDefaultName(size_t number);

  bool IsLocked(const std::string& keyring_id) const;
  bool IsLockedSync() const;
  bool HasPendingUnlockRequest() const;
  void RequestUnlock();
  std::optional<std::string> GetSelectedAccount(mojom::CoinType coin) const;
  std::optional<std::string> GetFilecoinSelectedAccount(
      const std::string& net) const;

  void AddObserver(
      ::mojo::PendingRemote<mojom::KeyringServiceObserver> observer) override;
  void NotifyUserInteraction() override;
  void GetSelectedAccount(mojom::CoinType coin,
                          GetSelectedAccountCallback callback) override;
  void GetFilecoinSelectedAccount(const std::string& net,
                                  GetSelectedAccountCallback callback) override;
  void SetSelectedAccount(const std::string& address,
                          mojom::CoinType coin,
                          SetSelectedAccountCallback callback) override;
  void GetAutoLockMinutes(GetAutoLockMinutesCallback callback) override;
  void SetAutoLockMinutes(int32_t minutes,
                          SetAutoLockMinutesCallback callback) override;
  void IsStrongPassword(const std::string& password,
                        IsStrongPasswordCallback callback) override;
  void ValidatePassword(const std::string& password,
                        ValidatePasswordCallback callback) override;
  void GetChecksumEthAddress(const std::string& address,
                             GetChecksumEthAddressCallback callback) override;
  void HasPendingUnlockRequest(
      HasPendingUnlockRequestCallback callback) override;

  void SignMessageForAuth(const std::string& address,
                          const std::string& nonce,
                          SignMessageForAuthCallback callback) override;

  std::optional<std::string> GetBitcoinReceivingAddress(
      const std::string& keyring_id,
      uint32_t account_index,
      uint32_t receiving_index);
  std::optional<std::string> GetBitcoinChangeAddress(
      const std::string& keyring_id,
      uint32_t account_index,
      uint32_t change_index);

  void SetLegacyKeystore(const base::Value::List& key_multi_store);
 private:
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, GetOrCreateNonceForKeyring);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, GetOrCreateSaltForKeyring);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, CreateEncryptorForKeyring);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, CreateDefaultKeyring);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest,
                           LazyCreateFilecoinKeyringFromImport);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest,
                           CreateDefaultKeyringInternal);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, RestoreDefaultKeyring);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, UnlockResumesDefaultKeyring);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest,
                           GetMnemonicForDefaultKeyring);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, LockAndUnlock);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, Reset);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, AccountMetasForKeyring);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, CreateAndRestoreWallet);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, AddAccount);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, ImportedAccounts);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest,
                           SetDefaultKeyringDerivedAccountMeta);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, RestoreLegacyBraveWallet);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, AutoLock);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, SetSelectedAccount);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, ImportFilecoinAccounts);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, PreCreateEncryptors);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, HardwareAccounts);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, DefaultSolanaAccountCreated);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest,
                           DefaultSolanaAccountRestored);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceUnitTest, AccountsAdded);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceAccountDiscoveryUnitTest,
                           AccountDiscovery);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceAccountDiscoveryUnitTest,
                           StopsOnError);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceAccountDiscoveryUnitTest,
                           ManuallyAddAccount);
  FRIEND_TEST_ALL_PREFIXES(KeyringServiceAccountDiscoveryUnitTest,
                           RestoreWalletTwice);
  FRIEND_TEST_ALL_PREFIXES(AssetDiscoveryManagerUnitTest,
                           KeyringServiceObserver);
  FRIEND_TEST_ALL_PREFIXES(SolanaProviderImplUnitTest,
                           ConnectWithNoSolanaAccount);

  friend class BraveWalletServiceUnitTest;
  friend class EthereumProviderImplUnitTest;
  friend class SolanaProviderImplUnitTest;
  friend class KeyringServiceAccountDiscoveryUnitTest;
  friend class EthTxManagerUnitTest;
  friend class FilTxManagerUnitTest;
  friend class KeyringServiceUnitTest;
  friend class AssetDiscoveryManagerUnitTest;
  friend class SolanaTransactionUnitTest;

  std::optional<std::string> FindImportedFilecoinKeyringId(
      const std::string& address) const;
  std::optional<std::string> FindBasicFilecoinKeyringId(
      const std::string& address) const;
  std::optional<std::string> FindHardwareFilecoinKeyringId(
      const std::string& address) const;
  std::optional<std::string> FindFilecoinKeyringId(
      const std::string& address) const;

  std::string GetImportedKeyringId(mojom::CoinType coin_type,
                                   const std::string& address) const;
  std::string GetKeyringId(mojom::CoinType coin_type,
                           const std::string& address) const;
  std::string GetKeyringIdForNetwork(mojom::CoinType coin_type,
                                     const std::string& network) const;
  std::string GetHardwareKeyringId(mojom::CoinType coin_type,
                                   const std::string& address) const;

  std::optional<std::string> AddAccountForKeyring(
      const std::string& keyring_id,
      const std::string& account_name);
  void AddDiscoveryAccountsForKeyring(size_t discovery_account_index,
                                      int attempts_left);
  void OnAutoLockFired();
  HDKeyring* GetHDKeyringById(const std::string& keyring_id) const;
  std::vector<mojom::AccountInfoPtr> GetHardwareAccountsSync(
      const std::string& keyring_id) const;
  // Address will be returned when success
  std::optional<std::string> ImportAccountForKeyring(
      const std::string& keyring_id,
      const std::string& account_name,
      const std::vector<uint8_t>& private_key);
  bool IsKeyringExist(const std::string& keyring_id) const;
  bool LazilyCreateKeyring(const std::string& keyring_id);

  std::vector<mojom::AccountInfoPtr> GetAccountInfosForKeyring(
      const std::string& id) const;
  bool UpdateNameForHardwareAccountSync(const std::string& address,
                                        const std::string& name,
                                        mojom::CoinType coin);
  std::string GetMnemonicForKeyringImpl(const std::string& keyring_id);

  std::vector<uint8_t> GetOrCreateNonceForKeyring(const std::string& id,
                                                  bool force_create = false);
  std::vector<uint8_t> GetOrCreateSaltForKeyring(const std::string& id,
                                                 bool force_create = false);
  bool CreateEncryptorForKeyring(const std::string& password,
                                 const std::string& id);
  HDKeyring* CreateKeyringInternal(const std::string& keyring_id,
                                   const std::string& mnemonic,
                                   bool is_legacy_brave_wallet);

  // Currently only support one default keyring, `CreateDefaultKeyring` and
  // `RestoreDefaultKeyring` will overwrite existing one if success
  HDKeyring* CreateKeyring(const std::string& keyring_id,
                           const std::string& mnemonic,
                           const std::string& password);
  // Restore default keyring from backup seed phrase
  HDKeyring* RestoreKeyring(const std::string& keyring_id,
                            const std::string& mnemonic,
                            const std::string& password,
                            bool is_legacy_brave_wallet);
  // It's used to reconstruct same default keyring between browser relaunch
  HDKeyring* ResumeKeyring(const std::string& keyring_id,
                           const std::string& password);

  void MaybeMigrateLegacyKeystore(const std::string& password);
  void MaybeMigrateLegacyAccount();

  void NotifyAccountsChanged();
  void NotifyAccountsAdded(mojom::CoinType coin,
                           const std::vector<std::string>& account_infos);
  void StopAutoLockTimer();
  void ResetAutoLockTimer();
  void OnAutoLockPreferenceChanged();
  void NotifySelectedAccountChanged(mojom::CoinType coin);
  bool SetSelectedAccountForCoinSilently(mojom::CoinType coin,
                                         const std::string& address);
  void SetSelectedAccountForCoin(mojom::CoinType coin,
                                 const std::string& address);
  void RemoveSelectedAccountForCoin(mojom::CoinType coin,
                                    const std::string& keyring_id);
  void OnGetTransactionCount(size_t discovery_account_index,
                             int attempts_left,
                             uint256_t result,
                             mojom::ProviderError error,
                             const std::string& error_message);

  void AddHardwareAccounts(std::vector<mojom::HardwareWalletAccountPtr> info,
                           const std::string keyring_id);

  bool ValidatePasswordInternal(const std::string& password);
  void MaybeUnlockWithCommandLine();

  std::unique_ptr<base::OneShotTimer> auto_lock_timer_;
  std::unique_ptr<PrefChangeRegistrar> pref_change_registrar_;
  base::flat_map<std::string, std::unique_ptr<HDKeyring>> keyrings_;
  base::flat_map<std::string, std::unique_ptr<PasswordEncryptor>> encryptors_;

  raw_ptr<JsonRpcService> json_rpc_service_;
  raw_ptr<PrefService> profile_prefs_ = nullptr;
  raw_ptr<PrefService> local_state_ = nullptr;
  bool request_unlock_pending_ = false;
  bool need_migrate_legacy_account = false;

  mojo::RemoteSet<mojom::KeyringServiceObserver> observers_;
  mojo::ReceiverSet<mojom::KeyringService> receivers_;

  base::WeakPtrFactory<KeyringService> discovery_weak_factory_{this};

  KeyringService(const KeyringService&) = delete;
  KeyringService& operator=(const KeyringService&) = delete;
};

}  // namespace brave_wallet

#endif  // BRAVE_COMPONENTS_BRAVE_WALLET_BROWSER_KEYRING_SERVICE_H_
