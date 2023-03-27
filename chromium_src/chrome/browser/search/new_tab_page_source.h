#ifndef CHROME_BROWSER_SEARCH_NEW_TAB_PAGE_SOURCE_H_
#define CHROME_BROWSER_SEARCH_NEW_TAB_PAGE_SOURCE_H_

#include "build/build_config.h"
#include "content/public/browser/url_data_source.h"


// Serves HTML for displaying suggestions for 3P remote NTPs using iframes
// of chrome-search://local-ntp/local-ntp.html.
class NewTabPageSource : public content::URLDataSource {
 public:
  NewTabPageSource();

  NewTabPageSource(const NewTabPageSource&) = delete;
  NewTabPageSource& operator=(const NewTabPageSource&) = delete;

  ~NewTabPageSource() override;

  // content::URLDataSource:
  std::string GetSource() override;
  void StartDataRequest(
      const GURL& url,
      const content::WebContents::Getter& wc_getter,
      content::URLDataSource::GotDataCallback callback) override;
  std::string GetMimeType(const GURL& url) override;
  bool ShouldServeMimeTypeAsContentTypeHeader() override;

  bool AllowCaching() override;
  bool ShouldDenyXFrameOptions() override;
  bool ShouldServiceRequest(const GURL& url,
                            content::BrowserContext* browser_context,
                            int render_process_id) override;

    std::string GetContentSecurityPolicy(
		          network::mojom::CSPDirectiveName directive) override;

 protected:
  // Returns whether this source should serve data for a particular path.
  virtual bool ServesPath(const std::string& path) const;

  // Sends unmodified resource bytes.
  void SendResource(int resource_id,
                    content::URLDataSource::GotDataCallback callback);

  // Sends Javascript with an expected postMessage origin interpolated.
  void SendJSWithOrigin(int resource_id,
                        const content::WebContents::Getter& wc_getter,
                        content::URLDataSource::GotDataCallback callback);

  // This is exposed for testing and should not be overridden.
  // Sets |origin| to the URL of the WebContents identified by |wc_getter|.
  // Returns true if successful and false if not, for example if the WebContents
  // does not exist
  virtual bool GetOrigin(const content::WebContents::Getter& wc_getter,
                         std::string* origin) const;
};

#endif  // CHROME_BROWSER_SEARCH_NEW_TAB_PAGE_SOURCE_H_
