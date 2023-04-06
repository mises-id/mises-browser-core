#include "build/build_config.h"
#if !BUILDFLAG(IS_ANDROID)
#include "src/chrome/browser/ui/browser_navigator.cc"
#else
#include "chrome/browser/ui/browser_navigator.h"

#include <algorithm>
#include <memory>
#include <string>
#include <utility>

#include "base/command_line.h"
#include "base/memory/raw_ptr.h"
#include "base/notreached.h"
#include "base/strings/utf_string_conversions.h"
#include "base/trace_event/trace_event.h"
#include "chrome/browser/ui/android/tab_model/tab_model.h"
#include "chrome/browser/ui/android/tab_model/tab_model_list.h"
#include "chrome/common/webui_url_constants.h"
#include "chrome/browser/ui/browser_navigator_params.h"

base::WeakPtr<content::NavigationHandle> Navigate(NavigateParams* params) {
  TRACE_EVENT1("navigation", "chrome::Navigate", "disposition",
               params->disposition);
    if (TabModelList::models().size() == 0)
      return nullptr;
    TabModel* tab_model = TabModelList::models()[0];
    if (params->url.is_valid() && !(params->url.is_empty())) {
      GURL url = params->url;
      tab_model->CreateNewTabForDevTools(url.is_empty() ? GURL(chrome::kChromeUINewTabURL) : url);
    }
    else if (params->contents_to_insert) {
      tab_model->CreateTab(nullptr, params->contents_to_insert.release());       
    }
    return nullptr;
}



bool IsHostAllowedInIncognito(const GURL& url) {
  std::string scheme = url.scheme();
  base::StringPiece host = url.host_piece();
  if (scheme != content::kChromeUIScheme)
    return true;

  if (host == chrome::kChromeUIChromeSigninHost) {
#if BUILDFLAG(IS_WIN)
    // Allow incognito mode for the chrome-signin url if we only want to
    // retrieve the login scope token without touching any profiles. This
    // option is only available on Windows for use with Google Credential
    // Provider for Windows.
    return signin::GetSigninReasonForEmbeddedPromoURL(url) ==
           signin_metrics::Reason::kFetchLstOnly;
#else
    return false;
#endif  // BUILDFLAG(IS_WIN)
  }

  // Most URLs are allowed in incognito; the following are exceptions.
  // chrome://extensions is on the list because it redirects to
  // chrome://settings.
  return host != chrome::kChromeUIAppLauncherPageHost &&
         host != chrome::kChromeUISettingsHost &&
#if BUILDFLAG(IS_CHROMEOS_ASH)
         host != chrome::kChromeUIOSSettingsHost &&
#endif
         host != chrome::kChromeUIHelpHost &&
         host != chrome::kChromeUIHistoryHost &&
         host != chrome::kChromeUIExtensionsHost &&
         host != chrome::kChromeUIBookmarksHost;
}

bool IsURLAllowedInIncognito(const GURL& url,
                             content::BrowserContext* browser_context) {
  if (url.scheme() == content::kViewSourceScheme) {
    // A view-source URL is allowed in incognito mode only if the URL itself
    // is allowed in incognito mode. Remove the "view-source:" from the start
    // of the URL and validate the rest.
    std::string stripped_spec = url.spec();
    DCHECK_GT(stripped_spec.size(), strlen(content::kViewSourceScheme));
    stripped_spec.erase(0, strlen(content::kViewSourceScheme) + 1);
    GURL stripped_url(stripped_spec);
    if (stripped_url.is_empty())
      return true;
    return stripped_url.is_valid() &&
           IsURLAllowedInIncognito(stripped_url, browser_context);
  }

  return IsHostAllowedInIncognito(url);
}

#endif
