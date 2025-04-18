/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/brave_wallet/browser/brave_wallet_p3a.h"

#include <utility>

#include "base/metrics/histogram_functions.h"
#include "base/metrics/histogram_macros.h"
#include "base/strings/string_number_conversions.h"
#include "base/time/time.h"
#include "mises/components/brave_wallet/browser/brave_wallet_service.h"
#include "mises/components/brave_wallet/browser/keyring_service.h"
#include "mises/components/brave_wallet/browser/pref_names.h"
#include "mises/components/brave_wallet/common/brave_wallet.mojom-forward.h"
#include "mises/components/p3a_utils/bucket.h"
#include "mises/components/p3a_utils/feature_usage.h"
#include "components/prefs/pref_service.h"
#include "components/prefs/scoped_user_pref_update.h"

namespace brave_wallet {

const char kDefaultWalletHistogramName[] = "Brave.Wallet.DefaultWalletSetting";
const char kDefaultSolanaWalletHistogramName[] =
    "Brave.Wallet.DefaultSolanaWalletSetting";
const char kKeyringCreatedHistogramName[] = "Brave.Wallet.KeyringCreated";
const char kOnboardingConversionHistogramName[] =
    "Brave.Wallet.OnboardingConversion.2";
const char kEthProviderHistogramName[] = "Brave.Wallet.EthProvider.3";
const char kSolProviderHistogramName[] = "Brave.Wallet.SolProvider";
const char kEthTransactionSentHistogramName[] =
    "Brave.Wallet.EthTransactionSent";
const char kSolTransactionSentHistogramName[] =
    "Brave.Wallet.SolTransactionSent";
const char kFilTransactionSentHistogramName[] =
    "Brave.Wallet.FilTransactionSent";
const char kEthActiveAccountHistogramName[] = "Brave.Wallet.ActiveEthAccounts";
const char kSolActiveAccountHistogramName[] = "Brave.Wallet.ActiveSolAccounts";
const char kFilActiveAccountHistogramName[] = "Brave.Wallet.ActiveFilAccounts";
const char kBraveWalletDailyHistogramName[] = "Brave.Wallet.UsageDaily";
const char kBraveWalletWeeklyHistogramName[] = "Brave.Wallet.UsageWeekly";
const char kBraveWalletMonthlyHistogramName[] = "Brave.Wallet.UsageMonthly";
const char kBraveWalletNewUserReturningHistogramName[] =
    "Brave.Wallet.NewUserReturning";
const char kBraveWalletLastUsageTimeHistogramName[] =
    "Brave.Wallet.LastUsageTime";

namespace {

constexpr int kRefreshP3AFrequencyHours = 24;
constexpr int kActiveAccountBuckets[] = {0, 1, 2, 3, 7};
const char* kTimePrefsToMigrateToLocalState[] = {kBraveWalletLastUnlockTime,
                                                 kBraveWalletP3AFirstUnlockTime,
                                                 kBraveWalletP3ALastUnlockTime};
const char* kTimePrefsToRemove[] = {kBraveWalletP3AFirstReportTime,
                                    kBraveWalletP3ALastReportTime};

// Has the Wallet keyring been created?
// 0) No, 1) Yes
void RecordKeyringCreated(mojom::KeyringInfoPtr keyring_info) {
  UMA_HISTOGRAM_BOOLEAN(kKeyringCreatedHistogramName,
                        static_cast<int>(keyring_info->is_keyring_created));
}

// What is the DefaultWalletSetting (Ethereum)?
// 0) AskDeprecated, 1) None, 2) CryptoWallets,
// 3) BraveWalletPreferExtension, 4) BraveWallet
void RecordDefaultEthereumWalletSetting(PrefService* pref_service) {
  const int max_bucket =
      static_cast<int>(brave_wallet::mojom::DefaultWallet::kMaxValue);
  auto default_wallet = pref_service->GetInteger(kDefaultEthereumWallet);
  UMA_HISTOGRAM_EXACT_LINEAR(kDefaultWalletHistogramName, default_wallet,
                             max_bucket);
}

// What is the DefaultSolanaWalletSetting?
// 0) AskDeprecated, 1) None, 2) CryptoWallets,
// 3) BraveWalletPreferExtension, 4) BraveWallet
void RecordDefaultSolanaWalletSetting(PrefService* pref_service) {
  const int max_bucket =
      static_cast<int>(brave_wallet::mojom::DefaultWallet::kMaxValue);
  auto default_wallet = pref_service->GetInteger(kDefaultSolanaWallet);
  UMA_HISTOGRAM_EXACT_LINEAR(kDefaultSolanaWalletHistogramName, default_wallet,
                             max_bucket);
}

}  // namespace

BraveWalletP3A::BraveWalletP3A(BraveWalletService* wallet_service,
                               KeyringService* keyring_service,
                               PrefService* profile_prefs,
                               PrefService* local_state)
    : wallet_service_(wallet_service),
      keyring_service_(keyring_service),
      profile_prefs_(profile_prefs),
      local_state_(local_state) {
  DCHECK(profile_prefs);
  DCHECK(local_state);

  MigrateUsageProfilePrefsToLocalState();

  RecordInitialBraveWalletP3AState();
  AddObservers();

  pref_change_registrar_.Init(local_state_);
  pref_change_registrar_.Add(kBraveWalletLastUnlockTime,
                             base::BindRepeating(&BraveWalletP3A::ReportUsage,
                                                 base::Unretained(this), true));
}

BraveWalletP3A::BraveWalletP3A() = default;

BraveWalletP3A::~BraveWalletP3A() = default;

void BraveWalletP3A::AddObservers() {
  wallet_service_->AddObserver(
      wallet_service_observer_receiver_.BindNewPipeAndPassRemote());
  keyring_service_->AddObserver(
      keyring_service_observer_receiver_.BindNewPipeAndPassRemote());
  update_timer_.Start(FROM_HERE, base::Hours(kRefreshP3AFrequencyHours), this,
                      &BraveWalletP3A::OnUpdateTimerFired);
  OnUpdateTimerFired();  // Also call on startup
}

mojo::PendingRemote<mojom::BraveWalletP3A> BraveWalletP3A::MakeRemote() {
  mojo::PendingRemote<mojom::BraveWalletP3A> remote;
  receivers_.Add(this, remote.InitWithNewPipeAndPassReceiver());
  return remote;
}

void BraveWalletP3A::Bind(
    mojo::PendingReceiver<mojom::BraveWalletP3A> receiver) {
  receivers_.Add(this, std::move(receiver));
}

void BraveWalletP3A::ReportUsage(bool unlocked) {
  VLOG(1) << "Wallet P3A: starting report";
  base::Time wallet_last_used =
      local_state_->GetTime(kBraveWalletLastUnlockTime);

  if (unlocked) {
    p3a_utils::RecordFeatureUsage(local_state_, kBraveWalletP3AFirstUnlockTime,
                                  kBraveWalletP3ALastUnlockTime);
    WriteUsageStatsToHistogram();
  } else {
    // Maybe record existing timestamp in case the user is not new.
    p3a_utils::MaybeRecordFeatureExistingUsageTimestamp(
        local_state_, kBraveWalletP3AFirstUnlockTime,
        kBraveWalletP3ALastUnlockTime, wallet_last_used);
  }

  p3a_utils::RecordFeatureNewUserReturning(
      local_state_, kBraveWalletP3AFirstUnlockTime,
      kBraveWalletP3ALastUnlockTime, kBraveWalletP3AUsedSecondDay,
      kBraveWalletNewUserReturningHistogramName);
  p3a_utils::RecordFeatureLastUsageTimeMetric(
      local_state_, kBraveWalletP3ALastUnlockTime,
      kBraveWalletLastUsageTimeHistogramName);
}

void BraveWalletP3A::ReportJSProvider(mojom::JSProviderType provider_type,
                                      mojom::CoinType coin_type,
                                      bool use_native_wallet_enabled,
                                      bool allow_provider_overwrite) {
  CHECK(coin_type == mojom::CoinType::ETH || coin_type == mojom::CoinType::SOL);

  std::optional<std::string> keyring_id =
      keyring_service_->GetKeyringIdForCoinNonFIL(coin_type);
  CHECK(keyring_id.has_value());

  const char* histogram_name;
  switch (coin_type) {
    case mojom::CoinType::ETH:
      histogram_name = kEthProviderHistogramName;
      break;
    case mojom::CoinType::SOL:
      histogram_name = kSolProviderHistogramName;
      break;
    default:
      NOTREACHED_NORETURN();
  }

  JSProviderAnswer answer = JSProviderAnswer::kNoWallet;
  bool is_wallet_setup = keyring_service_->IsKeyringCreated(*keyring_id);

  switch (provider_type) {
    case mojom::JSProviderType::None:
      // If there is no provider at all, we can assume that
      // the native wallet is disabled
      answer = JSProviderAnswer::kWalletDisabled;
      break;
    case mojom::JSProviderType::ThirdParty:
      // Third-party overriding is considered if the native wallet
      // is enabled and the native wallet is setup.
      answer = use_native_wallet_enabled && is_wallet_setup
                   ? JSProviderAnswer::kThirdPartyOverriding
                   : JSProviderAnswer::kThirdPartyNotOverriding;
      break;
    case mojom::JSProviderType::Native:
      // Only report native wallet provider if wallet has been set up,
      // otherwise report "no wallet".
      if (is_wallet_setup) {
        // A native wallet is definitely not being overridden
        // if provider overwrites are allowed.
        answer = !allow_provider_overwrite
                     ? JSProviderAnswer::kNativeOverridingDisallowed
                     : JSProviderAnswer::kNativeNotOverridden;
      }
      break;
    default:
      NOTREACHED_NORETURN();
  }

  base::UmaHistogramEnumeration(histogram_name, answer);
}

void BraveWalletP3A::ReportOnboardingAction(
    mojom::OnboardingAction onboarding_action) {
}

void BraveWalletP3A::ReportTransactionSent(mojom::CoinType coin,
                                           bool new_send) {
  const char* histogram_name = nullptr;
  switch (coin) {
    case mojom::CoinType::ETH:
      histogram_name = kEthTransactionSentHistogramName;
      break;
    case mojom::CoinType::SOL:
      histogram_name = kSolTransactionSentHistogramName;
      break;
    case mojom::CoinType::FIL:
      histogram_name = kFilTransactionSentHistogramName;
      break;
    case mojom::CoinType::BTC:
      // TODO(apaymyshev): https://github.com/brave/brave-browser/issues/28464
      return;
    default:
      return;
  }

  DCHECK(histogram_name);

  ScopedDictPrefUpdate last_sent_time_update(
      profile_prefs_, kBraveWalletLastTransactionSentTimeDict);
  base::Value::Dict& last_sent_time_dict = last_sent_time_update.Get();

  std::string coin_key = base::NumberToString(static_cast<int>(coin));

  base::Time now = base::Time::Now();
  base::Time last_sent_time = base::Time::FromSecondsSinceUnixEpoch(
      last_sent_time_dict.FindDouble(coin_key).value_or(0.0));

  if (!new_send && last_sent_time.is_null()) {
    // Don't report if a transaction was never sent.
    return;
  }
  int answer = 0;
  if (new_send || (now - last_sent_time) < base::Days(7)) {
    answer = 1;
  }
  if (new_send) {
    last_sent_time_dict.Set(coin_key, now.InSecondsFSinceUnixEpoch());
  }

  base::UmaHistogramExactLinear(histogram_name, answer, 2);
}

void BraveWalletP3A::RecordActiveWalletCount(int count,
                                             mojom::CoinType coin_type) {
  DCHECK_GE(count, 0);
  const char* histogram_name = nullptr;

  switch (coin_type) {
    case mojom::CoinType::ETH:
      histogram_name = kEthActiveAccountHistogramName;
      break;
    case mojom::CoinType::SOL:
      histogram_name = kSolActiveAccountHistogramName;
      break;
    case mojom::CoinType::FIL:
      histogram_name = kFilActiveAccountHistogramName;
      break;
    case mojom::CoinType::BTC:
      // TODO(apaymyshev): https://github.com/brave/brave-browser/issues/28464
      return;
    default:
      return;
  }

  DCHECK(histogram_name);

  const base::Value::Dict& active_wallet_dict =
      profile_prefs_->GetDict(kBraveWalletP3AActiveWalletDict);
  std::string coin_type_str = base::NumberToString(static_cast<int>(coin_type));
  if (!active_wallet_dict.FindBool(coin_type_str).has_value()) {
    if (count == 0) {
      // Should not record zero to histogram if user never had an active
      // account, to avoid sending unnecessary data.
      return;
    }
    ScopedDictPrefUpdate active_wallet_dict_update(
        profile_prefs_, kBraveWalletP3AActiveWalletDict);
    active_wallet_dict_update->Set(coin_type_str, true);
  }
  p3a_utils::RecordToHistogramBucket(histogram_name, kActiveAccountBuckets,
                                     count);
}

// TODO(djandries): remove pref migration around November 2023
void BraveWalletP3A::MigrateUsageProfilePrefsToLocalState() {
  for (const char* pref_name : kTimePrefsToMigrateToLocalState) {
    if (local_state_->GetTime(pref_name).is_null()) {
      base::Time profile_time = profile_prefs_->GetTime(pref_name);
      if (!profile_time.is_null()) {
        local_state_->SetTime(pref_name, profile_time);
        profile_prefs_->ClearPref(pref_name);
      }
    }
  }
  for (const char* pref_name : kTimePrefsToRemove) {
    local_state_->ClearPref(pref_name);
    profile_prefs_->ClearPref(pref_name);
  }
  if (!local_state_->GetBoolean(kBraveWalletP3AUsedSecondDay)) {
    bool profile_used_second_day =
        profile_prefs_->GetBoolean(kBraveWalletP3AUsedSecondDay);
    if (profile_used_second_day) {
      local_state_->SetBoolean(kBraveWalletP3AUsedSecondDay, true);
      profile_prefs_->ClearPref(kBraveWalletP3AUsedSecondDay);
    }
  }
  local_state_->ClearPref(kBraveWalletP3AWeeklyStorage);
  profile_prefs_->ClearPref(kBraveWalletP3AWeeklyStorage);
}

void BraveWalletP3A::OnUpdateTimerFired() {
  ReportUsage(false);
  ReportTransactionSent(mojom::CoinType::ETH, false);
  ReportTransactionSent(mojom::CoinType::FIL, false);
  ReportTransactionSent(mojom::CoinType::SOL, false);
}

void BraveWalletP3A::WriteUsageStatsToHistogram() {
  VLOG(1) << "Wallet P3A: Recording usage";
  UMA_HISTOGRAM_BOOLEAN(kBraveWalletMonthlyHistogramName, true);
  UMA_HISTOGRAM_BOOLEAN(kBraveWalletWeeklyHistogramName, true);
  UMA_HISTOGRAM_BOOLEAN(kBraveWalletDailyHistogramName, true);
}

void BraveWalletP3A::RecordInitialBraveWalletP3AState() {
  keyring_service_->GetKeyringInfo(mojom::kDefaultKeyringId,
                                   base::BindOnce(&RecordKeyringCreated));
  RecordDefaultEthereumWalletSetting(profile_prefs_);
  RecordDefaultSolanaWalletSetting(profile_prefs_);
}

// KeyringServiceObserver
void BraveWalletP3A::KeyringCreated(const std::string& keyring_id) {
  keyring_service_->GetKeyringInfo(keyring_id,
                                   base::BindOnce(&RecordKeyringCreated));
}

// BraveWalletServiceObserver
void BraveWalletP3A::OnDefaultEthereumWalletChanged(
    brave_wallet::mojom::DefaultWallet default_wallet) {
  RecordDefaultEthereumWalletSetting(profile_prefs_);
}

// BraveWalletServiceObserver
void BraveWalletP3A::OnDefaultSolanaWalletChanged(
    brave_wallet::mojom::DefaultWallet default_wallet) {
  RecordDefaultSolanaWalletSetting(profile_prefs_);
}

}  // namespace brave_wallet
