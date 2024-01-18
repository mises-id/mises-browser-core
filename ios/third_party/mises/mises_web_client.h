
#ifndef IOS_MISES_WEB_CLIENT_H_
#define IOS_MISES_WEB_CLIENT_H_

#include <memory>

#include "base/compiler_specific.h"
#import "ios/chrome/browser/web/chrome_web_client.h"

namespace web {

class MisesWebClient : public ChromeWebClient {
 public:
  MisesWebClient();

  MisesWebClient(const MisesWebClient&) = delete;
  MisesWebClient& operator=(const MisesWebClient&) = delete;

  ~MisesWebClient() override;

  NSString* GetDocumentStartScriptForAllFrames(
    BrowserState* browser_state) const;
  NSString* GetDocumentStartScriptForMainFrame(
      BrowserState* browser_state) const;

 private:
  NSArray* inpageScripts;
};

}  // namespace web

#endif
