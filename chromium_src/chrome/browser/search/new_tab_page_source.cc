#include "chrome/browser/search/new_tab_page_source.h"

#include "base/memory/ref_counted_memory.h"
#include "base/strings/string_piece.h"
#include "base/strings/string_util.h"
#include "build/build_config.h"
#include "chrome/browser/search/instant_service.h"
#include "chrome/common/url_constants.h"
#include "chrome/grit/new_tab_page_instant_resources.h"
#include "components/search/ntp_features.h"
#include "content/public/browser/navigation_entry.h"
#include "content/public/browser/web_contents.h"
#include "ui/base/resource/resource_bundle.h"
#include "url/gurl.h"

namespace {

// Multi-iframe version, used by third party remote NTPs.
const char kTitleHTMLPath[] = "/local-ntp.html";
const char kIncognitoHTMLPath[] = "/incognito-ntp.html";
const char kTitleCSSPath[] = "/local-ntp.css";
const char kTitleJSPath[] = "/local-ntp.js";

}  // namespace

NewTabPageSource::NewTabPageSource() = default;

NewTabPageSource::~NewTabPageSource() = default;

std::string NewTabPageSource::GetSource() {
  return "local-ntp";
}

void NewTabPageSource::StartDataRequest(
    const GURL& url,
    const content::WebContents::Getter& wc_getter,
    content::URLDataSource::GotDataCallback callback) {
  // TODO(crbug/1009127): Simplify usages of |path| since |url| is available.
  const std::string path(url.path());

  if (path == kTitleHTMLPath) {
    SendResource(IDR_NEW_TAB_PAGE_INSTANT_LOCAL_NTP_HTML,
                 std::move(callback));
  } else  if (path == kIncognitoHTMLPath) {
    SendResource(IDR_NEW_TAB_PAGE_INSTANT_INCOGNITO_NTP_HTML,
                 std::move(callback));
  } else if (path == kTitleCSSPath) {
    SendResource(IDR_NEW_TAB_PAGE_INSTANT_LOCAL_NTP_CSS,
                 std::move(callback));
  } else if (path == kTitleJSPath) {
    SendJSWithOrigin(IDR_NEW_TAB_PAGE_INSTANT_LOCAL_NTP_JS, wc_getter,
                     std::move(callback));
  } else if (path == "/loadingImage.js") {
    SendJSWithOrigin(IDR_NEW_TAB_PAGE_INSTANT_LOADINGIMAGE_JS, wc_getter,
                     std::move(callback));
  } else if (base::EndsWith(path, ".png", base::CompareCase::INSENSITIVE_ASCII)) {
    if (base::EndsWith(path, "Staking.png", base::CompareCase::INSENSITIVE_ASCII))
      SendResource(IDR_NEW_TAB_PAGE_INSTANT_IMAGES_STAKING_PNG,
                 std::move(callback));
    if (base::EndsWith(path, "Airdrop.png", base::CompareCase::INSENSITIVE_ASCII))
      SendResource(IDR_NEW_TAB_PAGE_INSTANT_IMAGES_AIRDROP_PNG,
                 std::move(callback));
    if (base::EndsWith(path, "Discover.png", base::CompareCase::INSENSITIVE_ASCII))
      SendResource(IDR_NEW_TAB_PAGE_INSTANT_IMAGES_DISCOVER_PNG,
                 std::move(callback));
    if (base::EndsWith(path, "Invite.png", base::CompareCase::INSENSITIVE_ASCII))
      SendResource(IDR_NEW_TAB_PAGE_INSTANT_IMAGES_INVITE_PNG,
                 std::move(callback));
    if (base::EndsWith(path, "Staking-dark.png", base::CompareCase::INSENSITIVE_ASCII))
      SendResource(IDR_NEW_TAB_PAGE_INSTANT_IMAGES_STAKING_DARK_PNG,
                 std::move(callback));
    if (base::EndsWith(path, "Airdrop-dark.png", base::CompareCase::INSENSITIVE_ASCII))
      SendResource(IDR_NEW_TAB_PAGE_INSTANT_IMAGES_AIRDROP_DARK_PNG,
                 std::move(callback));
    if (base::EndsWith(path, "Discover-dark.png", base::CompareCase::INSENSITIVE_ASCII))
      SendResource(IDR_NEW_TAB_PAGE_INSTANT_IMAGES_DISCOVER_DARK_PNG,
                 std::move(callback));
    if (base::EndsWith(path, "Invite-dark.png", base::CompareCase::INSENSITIVE_ASCII))
      SendResource(IDR_NEW_TAB_PAGE_INSTANT_IMAGES_INVITE_DARK_PNG,
                 std::move(callback));
    if (base::EndsWith(path, "add@2x.png", base::CompareCase::INSENSITIVE_ASCII))
      SendResource(IDR_NEW_TAB_PAGE_INSTANT_IMAGES_ADD_AT_2X_PNG,
                 std::move(callback));
    if (base::EndsWith(path, "more@2x.png", base::CompareCase::INSENSITIVE_ASCII))
      SendResource(IDR_NEW_TAB_PAGE_INSTANT_IMAGES_MORE_AT_2X_PNG,
                 std::move(callback));
    if (base::EndsWith(path, "down.png", base::CompareCase::INSENSITIVE_ASCII))
      SendResource(IDR_NEW_TAB_PAGE_INSTANT_IMAGES_DOWN_PNG,
                 std::move(callback));
  }else if (base::EndsWith(path, ".svg", base::CompareCase::INSENSITIVE_ASCII)) {
    if (base::EndsWith(path, "Private.svg", base::CompareCase::INSENSITIVE_ASCII))
	          SendResource(IDR_NEW_TAB_PAGE_INSTANT_IMAGES_PRIVATE_SVG,
				                   std::move(callback));
  } else {
    std::move(callback).Run(nullptr);
  }
}

std::string NewTabPageSource::GetMimeType(const GURL& url) {
  base::StringPiece path = url.path_piece();
  if (base::EndsWith(path, ".js", base::CompareCase::INSENSITIVE_ASCII))
    return "application/javascript";
  if (base::EndsWith(path, ".css", base::CompareCase::INSENSITIVE_ASCII))
    return "text/css";
  if (base::EndsWith(path, ".html", base::CompareCase::INSENSITIVE_ASCII))
    return "text/html";
  if (base::EndsWith(path, ".png", base::CompareCase::INSENSITIVE_ASCII))
    return "image/png";
  if (base::EndsWith(path, ".svg", base::CompareCase::INSENSITIVE_ASCII))
    return "image/svg+xml";
  return std::string();
}

bool NewTabPageSource::ShouldServeMimeTypeAsContentTypeHeader() {
  return true;
}

bool NewTabPageSource::AllowCaching() {
  return false;
}

bool NewTabPageSource::ShouldServiceRequest(
    const GURL& url,
    content::BrowserContext* browser_context,
    int render_process_id) {
  return InstantService::ShouldServiceRequest(url, browser_context,
                                              render_process_id) &&
         url.SchemeIs(chrome::kChromeSearchScheme) &&
         url.host_piece() == GetSource() && ServesPath(url.path());
}

bool NewTabPageSource::ShouldDenyXFrameOptions() {
  return false;
}

bool NewTabPageSource::ServesPath(const std::string& path) const {
  return path == kTitleHTMLPath || path == kTitleCSSPath ||
         path == kTitleJSPath || base::StartsWith(path, "/images/", base::CompareCase::INSENSITIVE_ASCII) ||
         path == "/new-ntp.html" || path == kIncognitoHTMLPath || path == "/loadingImage.js";
}

void NewTabPageSource::SendResource(
    int resource_id,
    content::URLDataSource::GotDataCallback callback) {
  std::move(callback).Run(
      ui::ResourceBundle::GetSharedInstance().LoadDataResourceBytes(
          resource_id));
}

void NewTabPageSource::SendJSWithOrigin(
    int resource_id,
    const content::WebContents::Getter& wc_getter,
    content::URLDataSource::GotDataCallback callback) {
  std::string origin;
  if (!GetOrigin(wc_getter, &origin)) {
    std::move(callback).Run(nullptr);
    return;
  }

  std::string response =
      ui::ResourceBundle::GetSharedInstance().LoadDataResourceString(
          resource_id);
  base::ReplaceFirstSubstringAfterOffset(&response, 0, "{{ORIGIN}}", origin);
  std::move(callback).Run(base::RefCountedString::TakeString(&response));
}

bool NewTabPageSource::GetOrigin(
    const content::WebContents::Getter& wc_getter,
    std::string* origin) const {
  if (wc_getter.is_null())
    return false;
  content::WebContents* contents = wc_getter.Run();
  if (!contents)
    return false;
  content::NavigationEntry* entry = contents->GetController().GetVisibleEntry();
  if (!entry)
    return false;

  *origin = entry->GetURL().DeprecatedGetOriginAsURL().spec();
  // Origin should not include a trailing slash. That is part of the path.
  base::TrimString(*origin, "/", origin);
  return true;
}


std::string NewTabPageSource::GetContentSecurityPolicy(
		    network::mojom::CSPDirectiveName directive) {


  if (directive == network::mojom::CSPDirectiveName::ScriptSrc) {
    // 'unsafe-inline' is added to script-src.
    return "script-src chrome://resources 'self' 'unsafe-inline';";
  } else if (directive == network::mojom::CSPDirectiveName::StyleSrc) {
    return "style-src 'self' 'unsafe-inline';";
  } else if (directive == network::mojom::CSPDirectiveName::ImgSrc) {
    return "";
  } else if (directive == network::mojom::CSPDirectiveName::TrustedTypes) {
    return "";
  } else if (directive == network::mojom::CSPDirectiveName::RequireTrustedTypesFor) {
    return "";
  }
  return content::URLDataSource::GetContentSecurityPolicy(directive);
}
