/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_COMPONENTS_IPFS_IPFS_JSON_PARSER_H_
#define BRAVE_COMPONENTS_IPFS_IPFS_JSON_PARSER_H_

#include <string>
#include <unordered_map>
#include <vector>

#include "base/values.h"
#include "mises/components/ipfs/addresses_config.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "mises/components/ipfs/import/imported_data.h"
#include "mises/components/ipfs/node_info.h"
#include "mises/components/ipfs/repo_stats.h"

#if BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
#include "mises/components/ipfs/pin/ipfs_pin_rpc_types.h"
#endif  // BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)

class IPFSJSONParser {
 public:
  static bool GetPeersFromJSON(const std::string& json,
                               std::vector<std::string>* peers);
  static bool GetAddressesConfigFromJSON(const std::string& json,
                                         ipfs::AddressesConfig* config);
  static bool GetRepoStatsFromJSON(const std::string& json,
                                   ipfs::RepoStats* config);
  static bool GetNodeInfoFromJSON(const std::string& json,
                                  ipfs::NodeInfo* info);
  static bool GetGarbageCollectionFromJSON(const std::string& json,
                                           std::string* error);
  static bool GetImportResponseFromJSON(const std::string& json,
                                        ipfs::ImportedData* data);
  static bool GetParseKeysFromJSON(
      const std::string& json,
      std::unordered_map<std::string, std::string>* keys);
  static bool GetParseSingleKeyFromJSON(const std::string& json,
                                        std::string* name,
                                        std::string* value);
  static bool GetPeersFromConfigJSON(const std::string& json,
                                     std::vector<std::string>* peers);
  static std::string PutNewPeerToConfigJSON(const std::string& json,
                                            const std::string& peer);
  static std::string RemovePeerFromConfigJSON(const std::string& json,
                                              const std::string& peer_id,
                                              const std::string& address);
#if BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
  // Local pins
  static std::optional<ipfs::AddPinResult> GetAddPinsResultFromJSON(
      const base::Value& value);
  static std::optional<ipfs::GetPinsResult> GetGetPinsResultFromJSON(
      const base::Value& value);
  static std::optional<ipfs::RemovePinResult> GetRemovePinsResultFromJSON(
      const base::Value& value);
#endif  // BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
};

#endif  // BRAVE_COMPONENTS_IPFS_IPFS_JSON_PARSER_H_
