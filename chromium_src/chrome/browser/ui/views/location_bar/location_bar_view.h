/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef MISES_CHROMIUM_SRC_CHROME_BROWSER_UI_VIEWS_LOCATION_BAR_LOCATION_BAR_VIEW_H_
#define MISES_CHROMIUM_SRC_CHROME_BROWSER_UI_VIEWS_LOCATION_BAR_LOCATION_BAR_VIEW_H_

#include "build/build_config.h"

#if !BUILDFLAG(IS_ANDROID)
#define MISES_LOCATION_BAR_VIEW_H_   \
 private:                            \
  friend class MisesLocationBarView; \
                                     \
 public:                             \
  virtual std::vector<views::View*> GetTrailingViews();
#else
#define MISES_LOCATION_BAR_VIEW_H_ \
 public:                             \
  virtual std::vector<views::View*> GetTrailingViews();
#endif

#define GetBorderRadius virtual GetBorderRadius
#include "src/chrome/browser/ui/views/location_bar/location_bar_view.h"
#undef GetBorderRadius
#undef MISES_LOCATION_BAR_VIEW_H_

#endif  // MISES_CHROMIUM_SRC_CHROME_BROWSER_UI_VIEWS_LOCATION_BAR_LOCATION_BAR_VIEW_H_
