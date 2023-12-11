// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef IOS_MISES_JAVA_SCRIPT_FEATURE_H_
#define IOS_MISES_JAVA_SCRIPT_FEATURE_H_

#import <WebKit/WebKit.h>

#include "base/memory/weak_ptr.h"
#include "base/supports_user_data.h"
#import "ios/web/js_messaging/scoped_wk_script_message_handler.h"
#import "ios/web/public/js_messaging/java_script_feature.h"

namespace web {
class BrowserState;

class MisesJavaScriptFeature : public base::SupportsUserData::Data,
                                        public JavaScriptFeature {
 public:
  static MisesJavaScriptFeature* FromBrowserState(
      BrowserState* browser_state);
  MisesJavaScriptFeature(BrowserState* browser_state);
  ~MisesJavaScriptFeature() override;

  void ConfigureHandlers(WKUserContentController* user_content_controller);

 private:
  MisesJavaScriptFeature(const MisesJavaScriptFeature&) =
      delete;
  MisesJavaScriptFeature& operator=(
      const MisesJavaScriptFeature&) = delete;

  // Handles a message from JavaScript to complete session restoration.
  void MetaMaskMessageReceived(WKScriptMessage* script_message);
  void MisesWalletMessageReceived(WKScriptMessage* script_message, ScriptMessageReplyHandler reply_handler);
  void KeplrMessageReceived(WKScriptMessage* script_message);

  // The browser state associated with this instance of the feature.
  BrowserState* browser_state_;

  // This feature uses ScopedWKScriptMessageHandler directly instead of the
  // message handling built into JavaScriptFeature because the WKWebView is used
  // to message the WKWebView directly since windowID is not yet setup during
  // session restoration. (The WKWebView is intentionally hidden from
  // JavaScriptFeature::ScriptMessageReceived).
  std::unique_ptr<ScopedWKScriptMessageHandler> mises_wallet_handler_;
  std::unique_ptr<ScopedWKScriptMessageHandler> keplr_handler_;
  std::unique_ptr<ScopedWKScriptMessageHandler> metamask_handler_;

  base::WeakPtrFactory<MisesJavaScriptFeature> weak_factory_;
};

}  // namespace web

#endif  // IOS_MISES_JAVA_SCRIPT_FEATURE_H_