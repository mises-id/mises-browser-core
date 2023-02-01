#pragma once

#include <string>
#include <vector>


#include "url/gurl.h"

class GURL;

namespace web3sites_safe {

};

struct Web3sitesResultType{
  enum Type {
  kNone = 0,
  kWhite = 1,
  kFuzzy = 2,
  kBlack = 3,

  kMaxValue = kBlack,
};
};
struct MisesURLCheckResult {

  const GURL check_url;

  typedef Web3sitesResultType::Type Type;

  Type result_type = Type::kWhite;

  GURL safe_url;


  MisesURLCheckResult(const GURL& check_url,
              Type result_type,
              GURL& safe_url);

  ~MisesURLCheckResult();

  MisesURLCheckResult(const MisesURLCheckResult& other);

  MisesURLCheckResult& operator=(const MisesURLCheckResult& check_result);
};

// Used for UKM. There is only a single Web3sitesSafeMatchType per navigation.
enum class Web3sitesSafeMatchType {
  kNone = 0,
};

// Used for UKM. There is only a single Web3sitesSafeBlockingPageUserAction per
// navigation.
enum class Web3sitesSafeBlockingPageUserAction {
  kInterstitialNotShown = 0,
  kClickThrough = 1,
  kAcceptSuggestion = 2,
  kCloseOrBack = 3,

  // Append new items to the end of the list above; do not modify or replace
  // existing values. Comment out obsolete items.
  kMaxValue = kCloseOrBack,
};


struct MisesDomainInfo {
  // The full ASCII hostname, used in detecting target embedding. For
  // "https://www.google.com/mail" this will be "www.google.com".
  const std::string hostname;
  // eTLD+1, used for skeleton and edit distance comparison. Must be ASCII.
  // Empty for non-unique domains, localhost or sites whose eTLD+1 is empty.
  const std::string domain_and_registry;
  // eTLD+1 without the registry part, and with a trailing period. For
  // "www.google.com", this will be "google.". Used for edit distance
  // comparisons. Empty for non-unique domains, localhost or sites whose eTLD+1
  // is empty.
  const std::string domain_without_registry;


  MisesDomainInfo(const std::string& arg_hostname,
             const std::string& arg_domain_and_registry,
             const std::string& arg_domain_without_registry);
  ~MisesDomainInfo();
  MisesDomainInfo(const MisesDomainInfo& other);
};

// Returns a MisesDomainInfo instance computed from |hostname|. Will return empty
// fields for non-unique hostnames (e.g. site.test), localhost or sites whose
// eTLD+1 is empty.
MisesDomainInfo GetMisesDomainInfo(const std::string& hostname);

// Convenience function for returning GetMisesDomainInfo(url.host()).
MisesDomainInfo GetMisesDomainInfo(const GURL& url);

std::string MisesGetETLDPlusOne(const std::string& hostname);
