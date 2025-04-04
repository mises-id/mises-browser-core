/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "crypto/symmetric_key.h"

#include "src/crypto/symmetric_key.cc"

#include "crypto/openssl_util.h"
#include "third_party/boringssl/src/include/openssl/evp.h"

namespace crypto {

// static
std::unique_ptr<SymmetricKey>
SymmetricKey::DeriveKeyFromPasswordUsingPbkdf2Sha256(
    Algorithm algorithm,
    const std::string& password,
    const std::string& salt,
    size_t iterations,
    size_t key_size_in_bits) {
  if (!CheckDerivationParameters(algorithm, key_size_in_bits))
    return nullptr;

  size_t key_size_in_bytes = key_size_in_bits / 8;

  OpenSSLErrStackTracer err_tracer(FROM_HERE);
  std::unique_ptr<SymmetricKey> key(new SymmetricKey);
  key->key_.resize(key_size_in_bytes, '\0');
  int rv = PKCS5_PBKDF2_HMAC(password.data(), password.length(),
                             reinterpret_cast<const uint8_t*>(salt.data()),
                             salt.length(), static_cast<unsigned>(iterations),
                             EVP_sha256(), key_size_in_bytes,
                             reinterpret_cast<uint8_t*>(key->key_.data()));
  return rv == 1 ? std::move(key) : nullptr;
}


// static
std::unique_ptr<SymmetricKey>
SymmetricKey::DeriveKeyFromPasswordUsingPbkdf2Sha512(
    Algorithm algorithm,
    const std::string& password,
    const std::string& salt,
    size_t iterations,
    size_t key_size_in_bits) {
  if (!CheckDerivationParameters(algorithm, key_size_in_bits))
    return nullptr;

  size_t key_size_in_bytes = key_size_in_bits / 8;

  OpenSSLErrStackTracer err_tracer(FROM_HERE);
  std::unique_ptr<SymmetricKey> key(new SymmetricKey);
  key->key_.resize(key_size_in_bytes, '\0');

  int rv = PKCS5_PBKDF2_HMAC(password.data(), password.length(),
                             reinterpret_cast<const uint8_t*>(salt.data()),
                             salt.length(), static_cast<unsigned>(iterations),
                             EVP_sha512(), key_size_in_bytes,
                             reinterpret_cast<uint8_t*>(key->key_.data()));
  return rv == 1 ? std::move(key) : nullptr;
}

}  // namespace crypto
