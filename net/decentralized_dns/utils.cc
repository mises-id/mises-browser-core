

#include "mises/net/decentralized_dns/utils.h"
#include "mises/net/decentralized_dns/constants.h"

#include "base/strings/string_util.h"
#define LookupSuffixInReversedSet LookupSuffixInReversedSet_ChromiumImpl
#include "net/base/lookup_string_in_fixed_set.h"
#undef LookupSuffixInReversedSet

namespace decentralized_dns {
namespace{
#include "mises/third_party/freename/freename_tld_names-reversed-inc.cc"
base::span<const uint8_t> g_dafsa_params = kDafsa;
}

bool IsIpfsLocalTLD(const std::string_view& host, size_t* suffix_length) {
  constexpr char kIpfsLocalhost[] = ".ipfs.localhost";
  constexpr char kIpnsLocalhost[] = ".ipns.localhost";

  static_assert(sizeof(kIpfsLocalhost) == sizeof(kIpnsLocalhost),
                "size should be equal");

  // Special cases to be treated as public suffixes for security concern.
  // With this, {CID}.ipfs.localhost with different CIDs cannot share cookies.
  if (base::EndsWith(host, kIpfsLocalhost) ||
      base::EndsWith(host, kIpnsLocalhost)) {
    //  Don't count the leading dot.
    if (suffix_length)
      *suffix_length = strlen(kIpfsLocalhost) - 1;
    return true;
  }

  return false;
}

bool IsUnstoppableDomainsTLD(const std::string_view& host, size_t* suffix_length) {
  for (auto* domain : kUnstoppableDomains) {
    if (base::EndsWith(host, domain)) {
      if (suffix_length)
        *suffix_length = strlen(domain) - 1;
      return true;
    }
  }
  return false;
}

bool IsBitTLD(const std::string_view& host, size_t* suffix_length) {
  if (base::EndsWith(host, kBitDomain)) {
    if (suffix_length)
      *suffix_length = strlen(decentralized_dns::kBitDomain) - 1;
    return true;
  }
  return false;
}

bool IsFreeNameTLD(const std::string_view& host, size_t* suffix_length) {
  size_t length;
  int type = net::LookupSuffixInReversedSet_ChromiumImpl(
    g_dafsa_params, false,
    host, &length);
  bool ret = type == net::kDafsaFound;
  if (ret) {
    if (suffix_length)
      *suffix_length = length;
  }
  return ret;
}

bool IsENSTLD(const std::string_view& host, size_t* suffix_length) {
  if (base::EndsWith(host, kEthDomain)) {
    if (suffix_length)
      *suffix_length = strlen(decentralized_dns::kEthDomain) - 1;
    return true;
  }
  return false;
}

bool IsDNSForEthDomain(const std::string_view& host, size_t* suffix_length) {
  if (base::EndsWith(host, decentralized_dns::kDNSForEthDomain)) {
    if (suffix_length)
      *suffix_length = strlen(decentralized_dns::kDNSForEthDomain) - 1;
    return true;
  }
  return false;
}

bool IsSnsTLD(const std::string_view& host, size_t* suffix_length) {
  if (base::EndsWith(host, kSolDomain)) {
    if (suffix_length)
      *suffix_length = strlen(decentralized_dns::kSolDomain) - 1;
    return true;
  }
  return false;
}


}
