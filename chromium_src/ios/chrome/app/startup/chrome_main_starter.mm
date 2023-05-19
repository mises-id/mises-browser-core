// Copyright 2016 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#import "ios/chrome/app/startup/chrome_main_starter.h"

#import "ios/chrome/app/startup/ios_chrome_main.h"

#include "mises/ios/third_party/mises/mises_web_client.h"

#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif

@implementation ChromeMainStarter

+ (std::unique_ptr<IOSChromeMain>)startChromeMain {
  std::unique_ptr<IOSChromeMain> main =  std::make_unique<IOSChromeMain>();

  // static std::unique_ptr<web::MisesWebClient> web_client;
  // web_client = std::make_unique<web::MisesWebClient>();
  // web::SetWebClient(web_client.get());

  return main;
}

@end
