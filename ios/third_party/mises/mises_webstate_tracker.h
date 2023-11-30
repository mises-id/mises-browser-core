/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef MISES_IOS_THIRD_PARTY_MISES_MISES_WEBSTATE_TRACKER_H_
#define MISES_IOS_THIRD_PARTY_MISES_MISES_WEBSTATE_TRACKER_H_

#include <memory>
#include <vector>

#include "ios/web/public/web_state_observer.h"
#import "ios/web/public/web_state_user_data.h"
#import <Webkit/Webkit.h>

namespace web {
class WebState;
}  // namespace web


namespace mises {

class MisesWebStateTracker
    : public web::WebStateObserver,
      public web::WebStateUserData<MisesWebStateTracker>
{
 public:
  MisesWebStateTracker(const MisesWebStateTracker&) = delete;
  MisesWebStateTracker& operator=(const MisesWebStateTracker&) = delete;

  ~MisesWebStateTracker() override;


 private:
  friend class web::WebStateUserData<MisesWebStateTracker>;
  MisesWebStateTracker(web::WebState* web_state);

  // web::WebStateObserver implementation.
  void DidFinishNavigation(web::WebState* web_state,
                           web::NavigationContext* navigation_context) override;

  void WebStateDestroyed(web::WebState* web_state) override;

  // The WebState this instance is observing. Will be null after
  // WebStateDestroyed has been called.
  web::WebState* web_state_ = nullptr;
  __weak WKWebView* weakwv = nullptr;

  WEB_STATE_USER_DATA_KEY_DECL();
};

}  // namespace brave_favicon

#endif  // BRAVE_IOS_BROWSER_FAVICON_BRAVE_IOS_WEB_FAVICON_DRIVER_H_
