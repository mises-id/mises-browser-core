/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "base/containers/adapters.h"
#include "mises/browser/ui/omnibox/mises_omnibox_client_impl.h"
#include "chrome/browser/ui/color/chrome_color_id.h"
#include "chrome/browser/ui/views/omnibox/omnibox_view_views.h"
#include "ui/views/style/typography.h"

#define MISES_LAYOUT_TRAILING_DECORATIONS                                    \
  auto right_most = GetTrailingViews();                                      \
  for (auto* item : base::Reversed(right_most)) {                            \
    if (item->GetVisible())                                                  \
      trailing_decorations.AddDecoration(vertical_padding, location_height,  \
                                         false, 0, /*intra_item_padding=*/0, \
                                         0, item);                           \
  }

#include "src/chrome/browser/ui/views/location_bar/location_bar_view.cc"
#undef MISES_LAYOUT_TRAILING_DECORATIONS

std::vector<views::View*> LocationBarView::GetTrailingViews() {
  return std::vector<views::View*>();
}