/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "base/containers/adapters.h"

#define MISES_LAYOUT_TRAILING_DECORATIONS                                 \
  auto right_most = GetTrailingViews();                                   \
  for (auto* item : base::Reversed(right_most)) {                         \
    if (item->GetVisible())                                               \
      trailing_decorations.AddDecoration(0, height(), false, 0, 0, item); \
  }

#include "src/chrome/browser/ui/views/location_bar/location_bar_view.cc"
#undef MISES_LAYOUT_TRAILING_DECORATIONS

std::vector<views::View*> LocationBarView::GetTrailingViews() {
  return std::vector<views::View*>();
}