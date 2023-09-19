/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/decentralized_dns/core/utils.h"

#include "base/strings/string_util.h"
#include "mises/components/decentralized_dns/core/constants.h"
#include "mises/components/decentralized_dns/core/pref_names.h"
#include "mises/net/decentralized_dns/constants.h"
#include "components/prefs/pref_registry_simple.h"
#include "components/prefs/pref_service.h"
#include "url/gurl.h"

namespace decentralized_dns {

void RegisterLocalStatePrefs(PrefRegistrySimple* registry) {
  registry->RegisterIntegerPref(kUnstoppableDomainsResolveMethod,
                                static_cast<int>(ResolveMethodTypes::ENABLED));
  registry->RegisterIntegerPref(kENSResolveMethod,
                                static_cast<int>(ResolveMethodTypes::ENABLED));
  registry->RegisterIntegerPref(
      kEnsOffchainResolveMethod,
      static_cast<int>(EnsOffchainResolveMethod::kAsk));
  registry->RegisterIntegerPref(kSnsResolveMethod,
                                static_cast<int>(ResolveMethodTypes::ASK));
}

void MigrateObsoleteLocalStatePrefs(PrefService* local_state) {
}

bool IsUnstoppableDomainsTLD(const base::StringPiece& host) {
  for (auto* domain : kUnstoppableDomains) {
    if (base::EndsWith(host, domain))
      return true;
  }
  return false;
}

void SetUnstoppableDomainsResolveMethod(PrefService* local_state,
                                        ResolveMethodTypes method) {
  local_state->SetInteger(kUnstoppableDomainsResolveMethod,
                          static_cast<int>(method));
}

ResolveMethodTypes GetUnstoppableDomainsResolveMethod(
    PrefService* local_state) {
  return static_cast<ResolveMethodTypes>(
      local_state->GetInteger(kUnstoppableDomainsResolveMethod));
}

bool IsUnstoppableDomainsResolveMethodAsk(PrefService* local_state) {
  if (!local_state) {
    return false;  // Treat it as disabled.
  }

  return local_state->GetInteger(kUnstoppableDomainsResolveMethod) ==
         static_cast<int>(ResolveMethodTypes::ASK);
}

bool IsUnstoppableDomainsResolveMethodEnabled(PrefService* local_state) {
  if (!local_state) {
    return false;  // Treat it as disabled.
  }

  return local_state->GetInteger(kUnstoppableDomainsResolveMethod) ==
         static_cast<int>(ResolveMethodTypes::ENABLED);
}

bool IsBitTLD(const base::StringPiece& host) {
  return base::EndsWith(host, kBitDomain);
}

bool IsFreeNameTLD(const base::StringPiece& host) {
  return base::EndsWith(host, ".metaverse");
}

bool IsENSTLD(const base::StringPiece& host) {
  return base::EndsWith(host, kEthDomain);
}

void SetENSResolveMethod(PrefService* local_state, ResolveMethodTypes method) {
  local_state->SetInteger(kENSResolveMethod, static_cast<int>(method));
}

ResolveMethodTypes GetENSResolveMethod(PrefService* local_state) {
  return static_cast<ResolveMethodTypes>(
      local_state->GetInteger(kENSResolveMethod));
}


bool IsENSResolveMethodAsk(PrefService* local_state) {
  if (!local_state) {
    return false;  // Treat it as disabled.
  }

  return local_state->GetInteger(kENSResolveMethod) ==
         static_cast<int>(ResolveMethodTypes::ASK);
}

bool IsENSResolveMethodEnabled(PrefService* local_state) {
  if (!local_state) {
    return false;  // Treat it as disabled.
  }

  return local_state->GetInteger(kENSResolveMethod) ==
         static_cast<int>(ResolveMethodTypes::ENABLED);
}

void SetEnsOffchainResolveMethod(PrefService* local_state,
                                 EnsOffchainResolveMethod method) {
  local_state->SetInteger(kEnsOffchainResolveMethod, static_cast<int>(method));
}

EnsOffchainResolveMethod GetEnsOffchainResolveMethod(PrefService* local_state) {
  return static_cast<EnsOffchainResolveMethod>(
      local_state->GetInteger(kEnsOffchainResolveMethod));
}


bool IsSnsTLD(const base::StringPiece& host) {
  return base::EndsWith(host, kSolDomain);
}

void SetSnsResolveMethod(PrefService* local_state, ResolveMethodTypes method) {
  local_state->SetInteger(kSnsResolveMethod, static_cast<int>(method));
}

ResolveMethodTypes GetSnsResolveMethod(PrefService* local_state) {
  return static_cast<ResolveMethodTypes>(
      local_state->GetInteger(kSnsResolveMethod));
}

bool IsSnsResolveMethodAsk(PrefService* local_state) {
  if (!local_state) {
    return false;  // Treat it as disabled.
  }

  return GetSnsResolveMethod(local_state) == ResolveMethodTypes::ASK;
}

bool IsSnsResolveMethodEnabled(PrefService* local_state) {
  if (!local_state) {
    return false;  // Treat it as disabled.
  }

  return GetSnsResolveMethod(local_state) == ResolveMethodTypes::ENABLED;
}

}  // namespace decentralized_dns
