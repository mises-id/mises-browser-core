/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/ui/toolbar/mises_location_bar_model_delegate.h"
#include "chrome/browser/ui/browser_command_controller.h"
#include "chrome/browser/ui/browser_content_setting_bubble_model_delegate.h"

#if !BUILDFLAG(IS_ANDROID)
#define BrowserLocationBarModelDelegate  MisesLocationBarModelDelegate
#endif

#include "src/chrome/browser/ui/browser.cc"

#if !BUILDFLAG(IS_ANDROID)
#undef BrowserLocationBarModelDelegate

#endif

#if BUILDFLAG(IS_ANDROID) 
SigninViewController::SigninViewController(Browser* browser)
    : browser_(browser) {}

SigninViewController::~SigninViewController() {
}
#endif