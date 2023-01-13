/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_BROWSER_BRAVE_CONTENT_BROWSER_CLIENT_H_
#define BRAVE_BROWSER_BRAVE_CONTENT_BROWSER_CLIENT_H_

#include <memory>
#include <string>
#include <vector>

#include "chrome/browser/chrome_content_browser_client.h"
#include "chrome/browser/chrome_browser_main.h"
#include "content/public/browser/browser_thread.h"
#include "content/public/browser/content_browser_client.h"
#include "mojo/public/cpp/bindings/pending_remote.h"
#include "services/metrics/public/cpp/ukm_source_id.h"
#include "third_party/abseil-cpp/absl/types/optional.h"
#include "third_party/blink/public/mojom/loader/referrer.mojom.h"

class PrefChangeRegistrar;

namespace content {
class BrowserContext;
class RenderProcessHost;
}  // namespace content

namespace blink {
class AssociatedInterfaceRegistry;
}  // namespace blink
namespace web_pref {
struct WebPreferences;
}  // namespace web_pref

class MisesContentBrowserClient : public ChromeContentBrowserClient {
 public:
  MisesContentBrowserClient();
  MisesContentBrowserClient(const MisesContentBrowserClient&) = delete;
  MisesContentBrowserClient& operator=(const MisesContentBrowserClient&) =
      delete;
  ~MisesContentBrowserClient() override;

  // Overridden from ChromeContentBrowserClient:
  std::unique_ptr<content::BrowserMainParts> CreateBrowserMainParts(
      bool is_integration_test) override;
  void BrowserURLHandlerCreated(content::BrowserURLHandler* handler) override;
  std::vector<std::unique_ptr<content::NavigationThrottle>>
  CreateThrottlesForNavigation(content::NavigationHandle* handle) override;

  static bool HandleURLOverrideRewrite(
      GURL* url,
      content::BrowserContext* browser_context);

};

#endif  // BRAVE_BROWSER_BRAVE_CONTENT_BROWSER_CLIENT_H_
