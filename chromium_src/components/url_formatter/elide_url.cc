
#include "build/build_config.h"

#include "src/components/url_formatter/elide_url.cc"

#if BUILDFLAG(IS_ANDROID)


namespace url_formatter {
std::u16string ElideUrl(const GURL& url,
                        const gfx::FontList& font_list,
                        float available_pixel_width) {
                            url::Parsed parsed;
  const std::u16string url_string = url_formatter::FormatUrl(
      url, url_formatter::kFormatUrlOmitDefaults, base::UnescapeRule::SPACES,
      &parsed, nullptr, nullptr);
  return url_string;
}

std::u16string ElideHost(const GURL& url,
                         const gfx::FontList& font_list,
                         float available_pixel_width) {
  std::u16string url_host;
  std::u16string url_domain;
  std::u16string url_subdomain;
  url_formatter::SplitHost(url, &url_host, &url_domain, &url_subdomain);
  return url_host;
}
}

#endif