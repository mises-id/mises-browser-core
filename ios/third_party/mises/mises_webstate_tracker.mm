/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#import "mises/ios/third_party/mises/mises_webstate_tracker.h"

#include "base/functional/bind.h"
#include "base/memory/ptr_util.h"
#include "ios/chrome/browser/browser_state/chrome_browser_state.h"
#include "ios/web/navigation/navigation_manager_impl.h"
#include "ios/web/public/browser_state.h"
#include "ios/web/public/navigation/navigation_item.h"
#include "ios/web/public/thread/web_thread.h"
#import "ios/web/web_state/web_state_impl.h"
#include "ios/web/web_state/ui/crw_web_controller.h"
#include "ios/chrome/browser/url/chrome_url_constants.h"

#include "mises/ios/buildflags.h"
#if !BUILDFLAG(MISES_CORE_FRAMEWORK)
#import <mises_wallet_framwork/mises_wallet_framwork-Swift.h>
#endif


#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif

namespace mises {

// Constructor / Destructor

MisesWebStateTracker::MisesWebStateTracker(
    web::WebState* web_state)
    : web_state_(web_state) {
  web_state_->AddObserver(this);
}

MisesWebStateTracker::~MisesWebStateTracker() {
  // WebFaviconDriver is owned by WebState (as it is a WebStateUserData), so
  // the WebStateDestroyed will be called before the destructor and the member
  // field reset to null.
  DCHECK(!web_state_);
}

// Notifications

void MisesWebStateTracker::DidFinishNavigation(
    web::WebState* web_state,
    web::NavigationContext* navigation_context) {
  BOOL isNTP = !web_state || web_state->GetLastCommittedURL() == kChromeUINewTabURL;
  if (isNTP) {
      return;
  }
  #if !BUILDFLAG(MISES_CORE_FRAMEWORK)
  // navigation_context->IsSameDocument()
  if (web_state && !web_state->GetBrowserState()->IsOffTheRecord()) {
    CRWWebController* web_controller =
    web::WebStateImpl::FromWebState(web_state)->GetWebController();
    if (web_controller) {
      weakwv =  [web_controller wkWebView];
      if (weakwv) {
        __strong WKWebView* wv = weakwv;
        [MisesWalletApi.shared handleWebViewFinishedNavagationWith:wv];
      }
    }
  } 
  #endif
}


void MisesWebStateTracker::WebStateDestroyed(web::WebState* web_state) {
  DCHECK_EQ(web_state_, web_state);
   #if !BUILDFLAG(MISES_CORE_FRAMEWORK)
  if (weakwv) {
      __strong WKWebView* wv = weakwv;
      if (wv) {
        [MisesWalletApi.shared handleWebViewWillCloseWith:wv];
      }
  }
  #endif
  web_state_->RemoveObserver(this);
  web_state_ = nullptr;
}

WEB_STATE_USER_DATA_KEY_IMPL(MisesWebStateTracker)

}  // namespace mises
