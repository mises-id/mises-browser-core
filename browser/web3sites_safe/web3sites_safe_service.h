#pragma once


#include "base/memory/raw_ptr.h"
#include "base/memory/weak_ptr.h"
#include "url/gurl.h"
#include "base/time/time.h"
#include "base/callback_forward.h"
#include "components/keyed_service/core/keyed_service.h"
#include "mises/components/web3sites_safe/core/web3sites_safe_util.h"

namespace network {
class SharedURLLoaderFactory;
class SimpleURLLoader;
}

class Profile;

namespace base {
class Clock;
}

class Web3sitesSafeService : public KeyedService {
  public:
   explicit Web3sitesSafeService(Profile* profile);

   Web3sitesSafeService(const Web3sitesSafeService&) = delete;
   Web3sitesSafeService& operator=(const Web3sitesSafeService&) = delete;

   ~Web3sitesSafeService() override;

   using MisesURLCheckCallback =
      base::OnceCallback<void(const MisesURLCheckResult&)>;

   static Web3sitesSafeService* Get(Profile* profile);

   bool Web3sitesNeedUpdating() const;

   bool IsWeb3sitesNeedCheck() const;

   bool IsWeb3sitesWhiteList() const;

   base::Clock* clock() const { return clock_; }

   void CheckWeb3sitesURL(std::unique_ptr<MisesURLCheckCallback> callback,const GURL& url);

   void StartURLCheck();

   void OnCheckResponse(MisesURLCheckResult& check_result);

   void OnURLCheckCompleted(const network::SimpleURLLoader* source,
                         std::unique_ptr<std::string> response_body);

   void UpdateWeb3sites();

   void OnUpdateWeb3sitesCompleted(const network::SimpleURLLoader* source,
                         std::unique_ptr<std::string> response_body);

 private:

  raw_ptr<Profile> profile_;

  std::vector<MisesDomainInfo> web3sites_origin_;

  base::Time last_web3sites_fetch_time_;

  bool is_fetch_web3sites_;

  raw_ptr<base::Clock> clock_;

  scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory_;

  std::unique_ptr<network::SimpleURLLoader> simple_url_loader_;

  std::unique_ptr<MisesURLCheckCallback> callback_;

  GURL check_url_;

};
