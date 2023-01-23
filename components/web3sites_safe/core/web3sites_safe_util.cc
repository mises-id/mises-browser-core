

#include "mises/components/web3sites_safe/core/web3sites_safe_util.h"

#include "base/trace_event/trace_event.h"
#include "net/base/registry_controlled_domains/registry_controlled_domain.h"
#include "net/base/url_util.h"


namespace web3sites_safe {

}

namespace {
const char* kPrivateRegistriesTreatedAsPublic[] = {"com.de", "com.se"};
}//end namespace

//MisesDomainInfo
MisesDomainInfo::MisesDomainInfo(const std::string& arg_hostname,
                       const std::string& arg_domain_and_registry,
                       const std::string& arg_domain_without_registry)
    : hostname(arg_hostname),
      domain_and_registry(arg_domain_and_registry),
      domain_without_registry(arg_domain_without_registry) {}

MisesDomainInfo::~MisesDomainInfo() = default;

MisesDomainInfo::MisesDomainInfo(const MisesDomainInfo&) = default;

MisesDomainInfo GetMisesDomainInfo(const std::string& hostname) {
  TRACE_EVENT0("navigation", "GetMisesDomainInfo");
  if (net::HostStringIsLocalhost(hostname) ||
      net::IsHostnameNonUnique(hostname)) {
    return MisesDomainInfo(std::string(), std::string(), std::string());
  }
  const std::string domain_and_registry = MisesGetETLDPlusOne(hostname);
  const std::string domain_without_registry = domain_and_registry;


  return MisesDomainInfo(hostname, domain_and_registry, domain_without_registry);
}

MisesDomainInfo GetMisesDomainInfo(const GURL& url) {
  return GetMisesDomainInfo(url.host());
}

std::string MisesGetETLDPlusOne(const std::string& hostname) {
  auto pub = net::registry_controlled_domains::GetDomainAndRegistry(
      hostname, net::registry_controlled_domains::EXCLUDE_PRIVATE_REGISTRIES);
  auto priv = net::registry_controlled_domains::GetDomainAndRegistry(
      hostname, net::registry_controlled_domains::INCLUDE_PRIVATE_REGISTRIES);
  // If there is no difference in eTLD+1 with/without private registries, then
  // the domain uses a public registry and we can return the eTLD+1 safely.
  if (pub == priv) {
    return pub;
  }
  // Otherwise, the domain uses a private registry and |pub| is that private
  // registry. If it's a de-facto-public registry, return the private eTLD+1.
  for (auto* private_registry : kPrivateRegistriesTreatedAsPublic) {
    if (private_registry == pub) {
      return priv;
    }
  }
  // Otherwise, ignore the normal private registry and return the public eTLD+1.
  return pub;
}
