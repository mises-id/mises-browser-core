/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/brave_wallet/browser/internal/hd_key.h"

#include <utility>

#include "base/check.h"
#include "base/containers/span.h"
#include "base/json/json_reader.h"
#include "base/values.h"
#include "base/logging.h"
#include "base/strings/strcat.h"
#include "base/strings/string_number_conversions.h"
#include "base/strings/string_split.h"
#include "base/strings/string_util.h"
#include "mises/components/brave_wallet/common/hash_utils.h"
#include "mises/third_party/bitcoin-core/src/src/base58.h"
#include "mises/third_party/bitcoin-core/src/src/bech32.h"
#include "mises/third_party/bitcoin-core/src/src/crypto/ripemd160.h"
#include "mises/third_party/bitcoin-core/src/src/secp256k1/include/secp256k1_recovery.h"
#include "mises/third_party/bitcoin-core/src/src/util/strencodings.h"
//#include "mises/vendor/bat-native-tweetnacl/tweetnacl.h"
#include "crypto/encryptor.h"
#include "crypto/sha2.h"
#include "crypto/symmetric_key.h"
#include "third_party/boringssl/src/include/openssl/hmac.h"


// #undef VLOG
// #define VLOG(level) LOG(INFO)

using crypto::Encryptor;
using crypto::SymmetricKey;

namespace brave_wallet {

namespace {
constexpr char kMasterSecret[] = "Bitcoin seed";
constexpr size_t kSHA512Length = 64;
constexpr uint32_t kHardenedOffset = 0x80000000;
constexpr size_t kSerializationLength = 78;

bool UTCPasswordVerification(const std::string& derived_key,
                             const std::vector<uint8_t>& ciphertext,
                             const std::string& mac,
                             size_t dklen, bool usingKeccak) {
  std::string hash_key = derived_key.substr(dklen / 2, dklen);                          
  std::vector<uint8_t> mac_verification_input(hash_key.begin(), hash_key.end());
  mac_verification_input.insert(mac_verification_input.end(),
                                ciphertext.begin(), ciphertext.end());
  // verify password
  std::vector<uint8_t> mac_verification;
  if (usingKeccak) {
    mac_verification = KeccakHash(mac_verification_input);
  } else {
    auto hash_array = crypto::SHA256Hash(mac_verification_input);
    mac_verification = std::vector<uint8_t>(hash_array.begin(), hash_array.end());
  }

  if (base::ToLowerASCII(base::HexEncode(mac_verification)) != mac) {
    VLOG(0) << __func__ << ": password does not match";
    return false;
  }
  return true;
}

bool UTCDecodeMetamaskMnemonic(std::vector<uint8_t>* raw_bytes) {
    //handle metamask mnemonic
    std::string json(raw_bytes->begin(), raw_bytes->end());
    auto parsed_json = base::JSONReader::ReadAndReturnValueWithError(json);
    if (!parsed_json.has_value() || !parsed_json->is_list()) {
      VLOG(0) << __func__ << ": UTC v3 json parsed failed because "
              << parsed_json.error().message;
      return false;
    }
    auto& array = parsed_json->GetList();
    if (array.size() == 0 || !array[0].is_dict()) {
        return false;
    }
    auto& dic = array[0].GetDict();
    auto* data = dic.FindDict("data");
    if (!data) {
        return false;
    }
    auto* mnemonic = data->FindList("mnemonic");
    if (!mnemonic) {
        return false;
    }
    raw_bytes->resize(mnemonic->size());
    for (size_t idx = 0; idx< mnemonic->size(); idx++) {
        (*raw_bytes)[idx] = (*mnemonic)[idx].GetInt();
    }
    return true;
}
bool UTCDecryptRawBytes(const std::string& derived_key,
                          const std::vector<uint8_t>& ciphertext,
                          const std::vector<uint8_t>& iv,
                          std::vector<uint8_t>* raw_bytes,
                          size_t dklen, bool usingKeccak, bool isCtr) {
  if (!raw_bytes)
    return false;
  std::string dkey;
  if (usingKeccak) {
    dkey = derived_key.substr(0, dklen / 2);
  } else {
    dkey = derived_key.substr(0, dklen);
  }
  std::unique_ptr<SymmetricKey> decryption_key =
      SymmetricKey::Import(SymmetricKey::AES, dkey);
  if (!decryption_key) {
    VLOG(1) << __func__ << ": raw key has to be 16 or 32 bytes for AES import";
    return false;
  }
  Encryptor encryptor;
  if (!encryptor.Init(decryption_key.get(), isCtr? Encryptor::Mode::CTR : Encryptor::Mode::CBC,
                      isCtr ? std::vector<uint8_t>() : iv)) {
    VLOG(0) << __func__ << ": encryptor init failed";
    return false;
  }
    
  if (isCtr && !encryptor.SetCounter(iv)) {
    VLOG(0) << __func__ << ": encryptor set counter failed";
    return false;
  }

  if (!encryptor.Decrypt(base::as_bytes(base::make_span(ciphertext)), raw_bytes)) {
    VLOG(0) << __func__ << ": encryptor decrypt failed";
    return false;
  }

  return true;
}

std::vector<uint8_t> Hash160(const std::vector<uint8_t>& input) {
  // BoringSSL in chromium doesn't have ripemd implementation built in BUILD.gn
  // only header
  std::vector<uint8_t> result(CRIPEMD160::OUTPUT_SIZE);

  std::array<uint8_t, crypto::kSHA256Length> sha256hash =
      crypto::SHA256Hash(input);
  DCHECK(!sha256hash.empty());

  CRIPEMD160()
      .Write(sha256hash.data(), sha256hash.size())
      .Finalize(result.data());

  return result;
}

}  // namespace

HDKey::HDKey()
    : identifier_(20),
      public_key_(33),
      chain_code_(32),
      secp256k1_ctx_(secp256k1_context_create(SECP256K1_CONTEXT_SIGN |
                                              SECP256K1_CONTEXT_VERIFY)) {}

HDKey::~HDKey() {
  secp256k1_context_destroy(secp256k1_ctx_);
}

// static
std::unique_ptr<HDKey> HDKey::GenerateFromSeed(
    const std::vector<uint8_t>& seed) {
  // 128 - 512 bits
  if (seed.size() < 16 || seed.size() > 64) {
    LOG(ERROR) << __func__ << ": Seed size should be 16 to 64 bytes";
    return nullptr;
  }

  SecureVector hmac(kSHA512Length);
  unsigned int out_len;
  if (!HMAC(EVP_sha512(), kMasterSecret, sizeof(kMasterSecret), seed.data(),
            seed.size(), hmac.data(), &out_len)) {
    LOG(ERROR) << __func__ << ": HMAC_SHA512 failed";
    return nullptr;
  }
  DCHECK(out_len == kSHA512Length);

  std::unique_ptr<HDKey> hdkey = std::make_unique<HDKey>();
  auto hmac_span = base::make_span(hmac);
  auto IL = hmac_span.first(kSHA512Length / 2);
  auto IR = hmac_span.last(kSHA512Length / 2);
  hdkey->SetPrivateKey(IL);
  hdkey->SetChainCode(IR);
  hdkey->path_ = kMasterNode;
  return hdkey;
}

// static
std::unique_ptr<HDKey> HDKey::GenerateFromExtendedKey(const std::string& key) {
  std::vector<unsigned char> decoded_key(kSerializationLength);
  if (!DecodeBase58Check(key, decoded_key, decoded_key.size())) {
    LOG(ERROR) << __func__ << ": DecodeBase58Check failed";
    return nullptr;
  }

  SecureVector buf(decoded_key.begin(), decoded_key.end());
  SecureZeroData(decoded_key.data(), decoded_key.size());
  // version(4) || depth(1) || parent_fingerprint(4) || index(4) || chain(32) ||
  // key(33)
  const uint8_t* ptr = buf.data();
  auto version = static_cast<ExtendedKeyVersion>(ptr[0] << 24 | ptr[1] << 16 |
                                                 ptr[2] << 8 | ptr[3] << 0);
  ptr += sizeof(version);

  uint8_t depth = *ptr;
  ptr += sizeof(depth);

  int32_t parent_fingerprint =
      ptr[0] << 24 | ptr[1] << 16 | ptr[2] << 8 | ptr[3] << 0;
  ptr += sizeof(parent_fingerprint);

  int32_t index = ptr[0] << 24 | ptr[1] << 16 | ptr[2] << 8 | ptr[3] << 0;
  ptr += sizeof(index);

  std::unique_ptr<HDKey> hdkey = std::make_unique<HDKey>();
  hdkey->depth_ = depth;
  hdkey->parent_fingerprint_ = parent_fingerprint;
  hdkey->index_ = index;

  std::vector<uint8_t> chain_code(ptr, ptr + 32);
  ptr += chain_code.size();
  hdkey->SetChainCode(chain_code);

  if (*ptr == 0x00) {
    DCHECK_EQ(version, ExtendedKeyVersion::kXprv);
    ptr += 1;  // Skip first zero byte which is not part of private key.
    hdkey->SetPrivateKey(base::make_span(ptr, ptr + 32));
  } else {
    DCHECK_EQ(version, ExtendedKeyVersion::kXpub);
    std::vector<uint8_t> public_key(ptr, ptr + 33);
    hdkey->SetPublicKey(public_key);
  }

  return hdkey;
}

// static
std::unique_ptr<HDKey> HDKey::GenerateFromPrivateKey(
    const std::vector<uint8_t>& private_key) {
  if (private_key.size() != 32)
    return nullptr;
  std::unique_ptr<HDKey> hd_key = std::make_unique<HDKey>();
  hd_key->SetPrivateKey(private_key);
  return hd_key;
}


bool HDKey::DecodeRawBytesFromV3UTC(const std::string& password,
                             const base::Value& parsed_json,
                             std::vector<uint8_t> *raw_bytes,
                             bool usingKeccak) 
{
  if (password.empty()) {
    VLOG(0) << __func__ << "empty password";
    return false;
  }
  if (!parsed_json.is_dict()) {
    VLOG(0) << __func__ << "not a dict";
    return false;
  }   
  const auto* crypto = &parsed_json.GetDict();
  const auto* kdf = crypto->FindString("kdf");
  if (!kdf) {
    VLOG(0) << __func__ << ": missing kdf";
    return false;
  }

  std::unique_ptr<SymmetricKey> derived_key = nullptr;
  const auto* kdfparams = crypto->FindDict("kdfparams");
  if (!kdfparams) {
    VLOG(0) << __func__ << ": missing kdfparams";
    return false;
  }
  auto dklen = kdfparams->FindInt("dklen");
  if (!dklen) {
    VLOG(0) << __func__ << ": missing dklen";
    return false;
  }
  if (*dklen < 32) {
    VLOG(0) << __func__ << ": dklen must be >=32";
    return false;
  }
  const auto* salt = kdfparams->FindString("salt");
  if (!salt) {
    VLOG(0) << __func__ << ": missing salt";
    return false;
  }
  std::vector<uint8_t> salt_bytes;
  if (!base::HexStringToBytes(*salt, &salt_bytes)) {
    VLOG(1) << __func__ << ": invalid salt";
    return false;
  }
  if (*kdf == "pbkdf2") {
    auto c = kdfparams->FindInt("c");
    if (!c) {
      VLOG(0) << __func__ << ": missing c";
      return false;
    }
    const auto* prf = kdfparams->FindString("prf");
    if (!prf) {
      VLOG(0) << __func__ << ": missing prf";
      return false;
    }
    if (*prf != "hmac-sha256" && *prf != "hmac-sha512") {
      VLOG(0) << __func__ << ": prf must be hmac-sha256 when using pbkdf2";
      return false;
    }
    if (*prf == "hmac-sha256") {
      derived_key = SymmetricKey::DeriveKeyFromPasswordUsingPbkdf2Sha256(
          SymmetricKey::AES, password,
          std::string(salt_bytes.begin(), salt_bytes.end()), (size_t)*c,
          (size_t)*dklen * 8);
    } else {
       derived_key = SymmetricKey::DeriveKeyFromPasswordUsingPbkdf2Sha512(
          SymmetricKey::AES, password,
          std::string(salt_bytes.begin(), salt_bytes.end()), (size_t)*c,
          (size_t)*dklen * 8);
    }
    if (!derived_key) {
      VLOG(1) << __func__ << ": pbkdf2 derivation failed";
      return false;
    }
  } else if (*kdf == "scrypt") {
    auto n = kdfparams->FindInt("n");
    if (!n) {
      VLOG(0) << __func__ << ": missing n";
      return false;
    }
    auto r = kdfparams->FindInt("r");
    if (!r) {
      VLOG(0) << __func__ << ": missing r";
      return false;
    }
    auto p = kdfparams->FindInt("p");
    if (!p) {
      VLOG(0) << __func__ << ": missing p";
      return false;
    }
    derived_key = SymmetricKey::DeriveKeyFromPasswordUsingScrypt(
        SymmetricKey::AES, password,
        std::string(salt_bytes.begin(), salt_bytes.end()), (size_t)*n,
        (size_t)*r, (size_t)*p, 512 * 1024 * 1024, (size_t)*dklen * 8);
    if (!derived_key) {
      VLOG(1) << __func__ << ": scrypt derivation failed";
      return false;
    }
  } else {
    VLOG(0) << __func__
            << ": kdf is not supported. (Only support pbkdf2 and scrypt)";
    return false;
  }

  const auto* mac = crypto->FindString("mac");
  if (!mac) {
    VLOG(0) << __func__ << ": missing mac";
    return false;
  }
  const auto* ciphertext = crypto->FindString("ciphertext");
  if (!ciphertext) {
    VLOG(0) << __func__ << ": missing ciphertext";
    return false;
  }
  std::vector<uint8_t> ciphertext_bytes;
  if (!base::HexStringToBytes(*ciphertext, &ciphertext_bytes)) {
    VLOG(1) << __func__ << ": invalid ciphertext";
    return false;
  }
    
    if (*mac != "") {
        if (!UTCPasswordVerification(derived_key->key(), ciphertext_bytes, *mac,
                                     *dklen, usingKeccak))
          return false;
    }


  const auto* cipher = crypto->FindString("cipher");
  if (!cipher) {
    VLOG(0) << __func__ << ": missing cipher";
    return false;
  }
  if (*cipher != "aes-128-ctr" && *cipher != "aes-128-cbc") {
    VLOG(0) << __func__
            << ": AES-128-CTR is the minimal requirement of version 3";
    return false;
  }

  std::vector<uint8_t> iv_bytes;
  const auto* iv = crypto->FindStringByDottedPath("cipherparams.iv");
  if (!iv) {
    VLOG(0) << __func__ << ": missing cipherparams.iv";
    return false;
  }
  if (!base::HexStringToBytes(*iv, &iv_bytes)) {
    VLOG(1) << __func__ << ": invalid iv";
    return false;
  }

  if (!UTCDecryptRawBytes(derived_key->key(), ciphertext_bytes, iv_bytes,
                            raw_bytes, *dklen, usingKeccak, *cipher == "aes-128-ctr")) {
    VLOG(1) << __func__ << ": UTCDecryptRawBytes fail";
    return false;
  }
    if (*mac == "" && raw_bytes) {
        if (!UTCDecodeMetamaskMnemonic(raw_bytes)) {
            return false;
        }
    }
  return true;                                        
}

// static
std::unique_ptr<HDKey> HDKey::GenerateFromV3UTC(const std::string& password,
                                                const std::string& json) {
  if (password.empty()) {
    VLOG(0) << __func__ << "empty password";
    return nullptr;
  }
  auto parsed_json = base::JSONReader::ReadAndReturnValueWithError(json);
  if (!parsed_json.has_value() || !parsed_json->is_dict()) {
    VLOG(0) << __func__ << ": UTC v3 json parsed failed because "
            << parsed_json.error().message;
    return nullptr;
  }
  auto& dict = parsed_json->GetDict();
  
  // check version
  auto version = dict.FindInt("version");
  if (!version || *version != 3) {
    VLOG(0) << __func__ << ": missing version or version is not 3";
    return nullptr;
  }

  const auto* crypto = dict.Find("crypto");
  if (!crypto) {
    VLOG(0) << __func__ << ": missing crypto";
    return nullptr;
  }


  std::vector<uint8_t> private_key;

  if (!DecodeRawBytesFromV3UTC(password, *crypto, &private_key, true)) {
    return nullptr;
  }
  return GenerateFromPrivateKey(private_key);
}

std::string HDKey::GetPath() const {
  return path_;
}

void HDKey::SetPrivateKey(base::span<const uint8_t> value) {
  if (value.size() != 32) {
    LOG(ERROR) << __func__ << ": pivate key must be 32 bytes";
    return;
  }
  private_key_.assign(value.begin(), value.end());
  GeneratePublicKey();
  identifier_ = Hash160(public_key_);

  const uint8_t* ptr = identifier_.data();
  fingerprint_ = ptr[0] << 24 | ptr[1] << 16 | ptr[2] << 8 | ptr[3] << 0;
}

std::string HDKey::GetPrivateExtendedKey(
    ExtendedKeyVersion version /*= ExtendedKeyVersion::kXprv*/) const {
  return Serialize(version, private_key_);
}

std::string HDKey::EncodePrivateKeyForExport() const {
  return base::ToLowerASCII(base::HexEncode(private_key_));
}

std::vector<uint8_t> HDKey::GetPrivateKeyBytes() const {
  return std::vector<uint8_t>(private_key_.begin(), private_key_.end());
}

std::vector<uint8_t> HDKey::GetPublicKeyBytes() const {
  DCHECK(!public_key_.empty());
  return public_key_;
}

void HDKey::SetPublicKey(const std::vector<uint8_t>& value) {
  // Compressed only
  if (value.size() != 33) {
    LOG(ERROR) << __func__ << ": public key must be 33 bytes";
    return;
  }
  // Verify public key
  secp256k1_pubkey pubkey;
  if (!secp256k1_ec_pubkey_parse(secp256k1_ctx_, &pubkey, value.data(),
                                 value.size())) {
    LOG(ERROR) << __func__ << ": not a valid public key";
    return;
  }
  public_key_ = value;
  identifier_ = Hash160(public_key_);

  const uint8_t* ptr = identifier_.data();
  fingerprint_ = ptr[0] << 24 | ptr[1] << 16 | ptr[2] << 8 | ptr[3] << 0;
}

std::string HDKey::GetPublicExtendedKey(
    ExtendedKeyVersion version /*= ExtendedKeyVersion::kXpub*/) const {
  return Serialize(version, public_key_);
}

// https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki#segwit-address-format
std::string HDKey::GetSegwitAddress() const {
  auto hash160 = Hash160(public_key_);
  std::vector<unsigned char> input;
  input.reserve(33);   // 1 + (160 / 5)
  input.push_back(0);  // the witness version
  ConvertBits<8, 5, true>([&](unsigned char c) { input.push_back(c); },
                          hash160.begin(), hash160.end());

  // TODO(apaymyshev): support testnet
  return bech32::Encode("bc", input);
}

std::vector<uint8_t> HDKey::GetUncompressedPublicKey() const {
  // uncompressed
  size_t public_key_len = 65;
  std::vector<uint8_t> public_key(public_key_len);
  secp256k1_pubkey pubkey;
  if (!secp256k1_ec_pubkey_parse(secp256k1_ctx_, &pubkey, public_key_.data(),
                                 public_key_.size())) {
    LOG(ERROR) << __func__ << ": secp256k1_ec_pubkey_parse failed";
    return public_key;
  }
  if (!secp256k1_ec_pubkey_serialize(secp256k1_ctx_, public_key.data(),
                                     &public_key_len, &pubkey,
                                     SECP256K1_EC_UNCOMPRESSED)) {
    LOG(ERROR) << __func__ << ": secp256k1_ec_pubkey_serialize failed";
  }

  return public_key;
}

std::vector<uint8_t> HDKey::GetPublicKeyFromX25519_XSalsa20_Poly1305() const {
  return GetUncompressedPublicKey();
  // size_t public_key_len = crypto_scalarmult_curve25519_tweet_BYTES;
  // std::vector<uint8_t> public_key(public_key_len);
  // const uint8_t* private_key_ptr = private_key_->data();
  // if (crypto_scalarmult_curve25519_tweet_base(public_key.data(),
  //                                             private_key_ptr) != 0)
  //   return std::vector<uint8_t>();
  // return public_key;
}

std::optional<std::vector<uint8_t>>
HDKey::DecryptCipherFromX25519_XSalsa20_Poly1305(
    const std::string& version,
    const std::vector<uint8_t>& nonce,
    const std::vector<uint8_t>& ephemeral_public_key,
    const std::vector<uint8_t>& ciphertext) const {
  return std::nullopt;
  // // Only x25519-xsalsa20-poly1305 is supported by MM at the time of writing
  // if (version != "x25519-xsalsa20-poly1305")
  //   return std::nullopt;
  // if (nonce.size() != crypto_box_curve25519xsalsa20poly1305_tweet_NONCEBYTES)
  //   return std::nullopt;
  // if (ephemeral_public_key.size() !=
  //     crypto_box_curve25519xsalsa20poly1305_tweet_PUBLICKEYBYTES)
  //   return std::nullopt;
  // if (private_key_.size() !=
  //     crypto_box_curve25519xsalsa20poly1305_tweet_SECRETKEYBYTES)
  //   return std::nullopt;

  // std::vector<uint8_t> padded_ciphertext = ciphertext;
  // padded_ciphertext.insert(padded_ciphertext.begin(), crypto_box_BOXZEROBYTES,
  //                          0);
  // std::vector<uint8_t> padded_plaintext(padded_ciphertext.size());
  // const uint8_t* private_key_ptr = private_key_.data();
  // if (crypto_box_open(padded_plaintext.data(), padded_ciphertext.data(),
  //                     padded_ciphertext.size(), nonce.data(),
  //                     ephemeral_public_key.data(), private_key_ptr) != 0)
  //   return std::nullopt;
  // std::vector<uint8_t> plaintext(
  //     padded_plaintext.cbegin() + crypto_box_ZEROBYTES,
  //     padded_plaintext.cend());
  // return plaintext;
}

void HDKey::SetChainCode(base::span<const uint8_t> value) {
  chain_code_.assign(value.begin(), value.end());
}

std::unique_ptr<HDKeyBase> HDKey::DeriveNormalChild(uint32_t index) {
  if (index >= kHardenedOffset) {
    return nullptr;
  }

  return DeriveChild(index);
}

std::unique_ptr<HDKeyBase> HDKey::DeriveHardenedChild(uint32_t index) {
  if (index >= kHardenedOffset) {
    return nullptr;
  }

  return DeriveChild(kHardenedOffset + index);
}

std::unique_ptr<HDKey> HDKey::DeriveChild(uint32_t index) {
  bool is_hardened = index >= kHardenedOffset;
  SecureVector data;

  if (is_hardened) {
    // Hardened: data = 0x00 || ser256(kpar) || ser32(index)
    DCHECK(!private_key_.empty());
    data.push_back(0x00);
    data.insert(data.end(), private_key_.begin(), private_key_.end());
  } else {
    // Normal private: data = serP(point(kpar)) || ser32(index)
    // Normal pubic  : data = serP(Kpar) || ser32(index)
    //     serP(Kpar) is public key when point(kpar) is private key
    data.insert(data.end(), public_key_.begin(), public_key_.end());
  }
  data.push_back((index >> 24) & 0xFF);
  data.push_back((index >> 16) & 0xFF);
  data.push_back((index >> 8) & 0xFF);
  data.push_back(index & 0xFF);

  SecureVector hmac(kSHA512Length);
  unsigned int out_len;
  if (!HMAC(EVP_sha512(), chain_code_.data(), chain_code_.size(), data.data(),
            data.size(), hmac.data(), &out_len)) {
    LOG(ERROR) << __func__ << ": HMAC_SHA512 failed";
    return nullptr;
  }
  DCHECK(out_len == kSHA512Length);

  auto hmac_span = base::make_span(hmac);
  auto IL = hmac_span.first(kSHA512Length / 2);
  auto IR = hmac_span.last(kSHA512Length / 2);

  std::unique_ptr<HDKey> hdkey = std::make_unique<HDKey>();
  hdkey->SetChainCode(IR);

  if (!private_key_.empty()) {
    // Private parent key -> private child key
    // Also Private parent key -> public child key because we always create
    // public key.
    SecureVector private_key = private_key_;
    if (!secp256k1_ec_seckey_tweak_add(secp256k1_ctx_, private_key.data(),
                                       IL.data())) {
      LOG(ERROR) << __func__ << ": secp256k1_ec_seckey_tweak_add failed";
      return nullptr;
    }
    hdkey->SetPrivateKey(private_key);
  } else {
    // Public parent key -> public child key (Normal only)
    DCHECK(!is_hardened);
    secp256k1_pubkey pubkey;
    if (!secp256k1_ec_pubkey_parse(secp256k1_ctx_, &pubkey, public_key_.data(),
                                   public_key_.size())) {
      LOG(ERROR) << __func__ << ": secp256k1_ec_pubkey_parse failed";
      return nullptr;
    }

    if (!secp256k1_ec_pubkey_tweak_add(secp256k1_ctx_, &pubkey, IL.data())) {
      LOG(ERROR) << __func__ << ": secp256k1_ec_pubkey_tweak_add failed";
      return nullptr;
    }
    size_t public_key_len = 33;
    std::vector<uint8_t> public_key(public_key_len);
    if (!secp256k1_ec_pubkey_serialize(secp256k1_ctx_, public_key.data(),
                                       &public_key_len, &pubkey,
                                       SECP256K1_EC_COMPRESSED)) {
      LOG(ERROR) << __func__ << ": secp256k1_ec_pubkey_serialize failed";
      return nullptr;
    }
    hdkey->SetPublicKey(public_key);
  }

  if (!path_.empty()) {
    const std::string node =
        is_hardened ? base::NumberToString(index - kHardenedOffset) + "'"
                    : base::NumberToString(index);

    hdkey->path_ = base::StrCat({path_, "/", node});
  }
  hdkey->depth_ = depth_ + 1;
  hdkey->parent_fingerprint_ = fingerprint_;
  hdkey->index_ = index;

  return hdkey;
}

std::unique_ptr<HDKeyBase> HDKey::DeriveChildFromPath(const std::string& path) {
  if (path_ != kMasterNode) {
    LOG(ERROR) << __func__ << ": must derive only from master key";
    return nullptr;
  }
  if (private_key_.empty()) {
    LOG(ERROR) << __func__ << ": master key must have private key";
    return nullptr;
  }

  std::unique_ptr<HDKey> hd_key = std::make_unique<HDKey>();
  std::vector<std::string> entries =
      base::SplitString(path, "/", base::WhitespaceHandling::TRIM_WHITESPACE,
                        base::SplitResult::SPLIT_WANT_NONEMPTY);
  if (entries.empty()) {
    return nullptr;
  }

  // Starting with 'm' node and effectively copying `*this` into `hd_key`.
  if (entries[0] != kMasterNode) {
    LOG(ERROR) << __func__ << ": path must start with \"m\"";
    return nullptr;
  }
  hd_key->SetPrivateKey(private_key_);
  hd_key->SetChainCode(chain_code_);
  hd_key->path_ = path_;

  for (size_t i = 1; i < entries.size(); ++i) {
    std::string entry = entries[i];

    bool is_hardened = entry.length() > 1 && entry.back() == '\'';
    if (is_hardened) {
      entry.pop_back();
    }
    unsigned child_index = 0;
    if (!base::StringToUint(entry, &child_index)) {
      LOG(ERROR) << __func__ << ": path must contain number or number'";
      return nullptr;
    }
    if (child_index >= kHardenedOffset) {
      LOG(ERROR) << __func__ << ": index must be less than " << kHardenedOffset;
      return nullptr;
    }
    if (is_hardened) {
      child_index += kHardenedOffset;
    }

    hd_key = hd_key->DeriveChild(child_index);
    if (!hd_key) {
      return nullptr;
    }
  }

  DCHECK_EQ(path, hd_key->GetPath());

  return hd_key;
}

std::vector<uint8_t> HDKey::Sign(const std::vector<uint8_t>& msg, int* recid) {
  std::vector<uint8_t> sig(64);
  if (msg.size() != 32) {
    LOG(ERROR) << __func__ << ": message length should be 32";
    return sig;
  }
  if (!recid) {
    secp256k1_ecdsa_signature ecdsa_sig;
    if (!secp256k1_ecdsa_sign(secp256k1_ctx_, &ecdsa_sig, msg.data(),
                              private_key_.data(),
                              secp256k1_nonce_function_rfc6979, nullptr)) {
      LOG(ERROR) << __func__ << ": secp256k1_ecdsa_sign failed";
      return sig;
    }

    if (!secp256k1_ecdsa_signature_serialize_compact(secp256k1_ctx_, sig.data(),
                                                     &ecdsa_sig)) {
      LOG(ERROR) << __func__
                 << ": secp256k1_ecdsa_signature_serialize_compact failed";
    }
  } else {
    secp256k1_ecdsa_recoverable_signature ecdsa_sig;
    if (!secp256k1_ecdsa_sign_recoverable(
            secp256k1_ctx_, &ecdsa_sig, msg.data(), private_key_.data(),
            secp256k1_nonce_function_rfc6979, nullptr)) {
      LOG(ERROR) << __func__ << ": secp256k1_ecdsa_sign_recoverable failed";
      return sig;
    }
    if (!secp256k1_ecdsa_recoverable_signature_serialize_compact(
            secp256k1_ctx_, sig.data(), recid, &ecdsa_sig)) {
      LOG(ERROR)
          << __func__
          << ": secp256k1_ecdsa_recoverable_signature_serialize_compact failed";
    }
  }

  return sig;
}

bool HDKey::Verify(const std::vector<uint8_t>& msg,
                   const std::vector<uint8_t>& sig) {
  if (msg.size() != 32 || sig.size() != 64) {
    LOG(ERROR) << __func__ << ": message or signature length is invalid";
    return false;
  }

  secp256k1_ecdsa_signature ecdsa_sig;
  if (!secp256k1_ecdsa_signature_parse_compact(secp256k1_ctx_, &ecdsa_sig,
                                               sig.data())) {
    LOG(ERROR) << __func__
               << ": secp256k1_ecdsa_signature_parse_compact failed";
    return false;
  }
  secp256k1_pubkey pubkey;
  if (!secp256k1_ec_pubkey_parse(secp256k1_ctx_, &pubkey, public_key_.data(),
                                 public_key_.size())) {
    LOG(ERROR) << __func__ << ": secp256k1_ec_pubkey_parse failed";
    return false;
  }
  if (!secp256k1_ecdsa_verify(secp256k1_ctx_, &ecdsa_sig, msg.data(),
                              &pubkey)) {
    LOG(ERROR) << __func__ << ": secp256k1_ecdsa_verify failed";
    return false;
  }
  return true;
}

std::vector<uint8_t> HDKey::Recover(bool compressed,
                                    const std::vector<uint8_t>& msg,
                                    const std::vector<uint8_t>& sig,
                                    int recid) {
  size_t public_key_len = compressed ? 33 : 65;
  std::vector<uint8_t> public_key(public_key_len);
  if (msg.size() != 32 || sig.size() != 64) {
    LOG(ERROR) << __func__ << ": message or signature length is invalid";
    return public_key;
  }
  if (recid < 0 || recid > 3) {
    LOG(ERROR) << __func__ << ": recovery id must be 0, 1, 2 or 3";
    return public_key;
  }

  secp256k1_ecdsa_recoverable_signature ecdsa_sig;
  if (!secp256k1_ecdsa_recoverable_signature_parse_compact(
          secp256k1_ctx_, &ecdsa_sig, sig.data(), recid)) {
    LOG(ERROR)
        << __func__
        << ": secp256k1_ecdsa_recoverable_signature_parse_compact failed";
    return public_key;
  }

  secp256k1_pubkey pubkey;
  if (!secp256k1_ecdsa_recover(secp256k1_ctx_, &pubkey, &ecdsa_sig,
                               msg.data())) {
    LOG(ERROR) << __func__ << ": secp256k1_ecdsa_recover failed";
    return public_key;
  }

  if (!secp256k1_ec_pubkey_serialize(
          secp256k1_ctx_, public_key.data(), &public_key_len, &pubkey,
          compressed ? SECP256K1_EC_COMPRESSED : SECP256K1_EC_UNCOMPRESSED)) {
    LOG(ERROR) << "secp256k1_ec_pubkey_serialize failed";
  }

  return public_key;
}

void HDKey::GeneratePublicKey() {
  secp256k1_pubkey public_key;
  if (!secp256k1_ec_pubkey_create(secp256k1_ctx_, &public_key,
                                  private_key_.data())) {
    LOG(ERROR) << "secp256k1_ec_pubkey_create failed";
    return;
  }
  size_t public_key_len = 33;
  if (!secp256k1_ec_pubkey_serialize(secp256k1_ctx_, public_key_.data(),
                                     &public_key_len, &public_key,
                                     SECP256K1_EC_COMPRESSED)) {
    LOG(ERROR) << "secp256k1_ec_pubkey_serialize failed";
  }
}

// https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#serialization-format
std::string HDKey::Serialize(ExtendedKeyVersion version,
                             base::span<const uint8_t> key) const {
  // version(4) || depth(1) || parent_fingerprint(4) || index(4) || chain(32) ||
  // key(32 or 33)
  SecureVector buf;

  buf.reserve(kSerializationLength);

  uint32_t version_uint32 = static_cast<uint32_t>(version);

  buf.push_back((version_uint32 >> 24) & 0xFF);
  buf.push_back((version_uint32 >> 16) & 0xFF);
  buf.push_back((version_uint32 >> 8) & 0xFF);
  buf.push_back((version_uint32 >> 0) & 0xFF);

  buf.push_back(depth_);

  buf.push_back((parent_fingerprint_ >> 24) & 0xFF);
  buf.push_back((parent_fingerprint_ >> 16) & 0xFF);
  buf.push_back((parent_fingerprint_ >> 8) & 0xFF);
  buf.push_back(parent_fingerprint_ & 0xFF);

  buf.push_back((index_ >> 24) & 0xFF);
  buf.push_back((index_ >> 16) & 0xFF);
  buf.push_back((index_ >> 8) & 0xFF);
  buf.push_back(index_ & 0xFF);

  buf.insert(buf.end(), chain_code_.begin(), chain_code_.end());
  if (key.size() == 32) {
    DCHECK(version == ExtendedKeyVersion::kXprv ||
           version == ExtendedKeyVersion::kYprv ||
           version == ExtendedKeyVersion::kZprv);
    // 32-bytes private key is padded with a zero byte.
    buf.insert(buf.end(), 0);
  } else {
    DCHECK(version == ExtendedKeyVersion::kXpub ||
           version == ExtendedKeyVersion::kYpub ||
           version == ExtendedKeyVersion::kZpub);
    DCHECK_EQ(key.size(), 33u);
  }
  buf.insert(buf.end(), key.begin(), key.end());

  DCHECK(buf.size() == kSerializationLength);
  return EncodeBase58Check(buf);
}

}  // namespace brave_wallet
