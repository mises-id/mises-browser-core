/* Copyright 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include <memory>

#include "mises/browser/ui/views/frame/mises_browser_non_client_frame_view_mac.h"

// #include "mises/browser/ui/tabs/mises_tab_prefs.h"
// #include "mises/browser/ui/views/frame/mises_non_client_hit_test_helper.h"
// #include "mises/browser/ui/views/frame/mises_window_frame_graphic.h"
// #include "mises/browser/ui/views/tabs/features.h"
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/view_ids.h"
#include "chrome/browser/ui/views/frame/browser_view.h"
#include "ui/base/hit_test.h"
#include "ui/gfx/geometry/insets.h"
#include "ui/gfx/geometry/rect.h"
#include "ui/gfx/scoped_canvas.h"

MisesBrowserNonClientFrameViewMac::MisesBrowserNonClientFrameViewMac(
    BrowserFrame* frame, BrowserView* browser_view)
    : BrowserNonClientFrameViewMac(frame, browser_view) {
  //auto* browser = browser_view->browser();
  // frame_graphic_ =
  //     std::make_unique<MisesWindowFrameGraphic>(browser->profile());

  // if (tabs::features::ShouldShowVerticalTabs(browser)) {
  //   auto* prefs = browser->profile()->GetOriginalProfile()->GetPrefs();
  //   show_vertical_tabs_.Init(
  //       brave_tabs::kVerticalTabsEnabled, prefs,
  //       base::BindRepeating(
  //           &MisesBrowserNonClientFrameViewMac::UpdateWindowTitleAndControls,
  //           base::Unretained(this)));
  //   show_title_bar_on_vertical_tabs_.Init(
  //       brave_tabs::kVerticalTabsShowTitleOnWindow, prefs,
  //       base::BindRepeating(
  //           &MisesBrowserNonClientFrameViewMac::UpdateWindowTitleVisibility,
  //           base::Unretained(this)));
  // }
}

MisesBrowserNonClientFrameViewMac::~MisesBrowserNonClientFrameViewMac() = default;

void MisesBrowserNonClientFrameViewMac::OnPaint(gfx::Canvas* canvas) {
  BrowserNonClientFrameViewMac::OnPaint(canvas);

  // // Don't draw frame graphic over border outline.
  // gfx::ScopedCanvas scoped_canvas(canvas);
  // gfx::Rect bounds_to_frame_graphic(bounds());
  // if (!IsFrameCondensed()) {
  //   // Native frame has 1px border outline.
  //   constexpr int kFrameBorderOutlineThickness = 1;
  //   bounds_to_frame_graphic.Inset(gfx::Insets::VH(
  //       kFrameBorderOutlineThickness, kFrameBorderOutlineThickness));
  //   canvas->ClipRect(bounds_to_frame_graphic);
  // }
  // frame_graphic_->Paint(canvas, bounds_to_frame_graphic);
}

int MisesBrowserNonClientFrameViewMac::GetTopInset(bool restored) const {
  if (ShouldShowWindowTitleForVerticalTabs()) {
    // Set minimum top inset to show caption buttons on frame.
    return 30;
  }

  return BrowserNonClientFrameViewMac::GetTopInset(restored);
}

bool MisesBrowserNonClientFrameViewMac::ShouldShowWindowTitleForVerticalTabs()
    const {
  // return tabs::features::ShouldShowWindowTitleForVerticalTabs(
  //     browser_view()->browser());
  return false;
}

void MisesBrowserNonClientFrameViewMac::UpdateWindowTitleVisibility() {
  if (!browser_view()->browser()->is_type_normal())
    return;

  //frame()->SetWindowTitleVisibility(ShouldShowWindowTitleForVerticalTabs());
}

int MisesBrowserNonClientFrameViewMac::NonClientHitTest(
    const gfx::Point& point) {
  // if (auto res = brave::NonClientHitTest(browser_view(), point);
  //     res != HTNOWHERE) {
  //   return res;
  // }

  return BrowserNonClientFrameViewMac::NonClientHitTest(point);
}

void MisesBrowserNonClientFrameViewMac::UpdateWindowTitleAndControls() {
  UpdateWindowTitleVisibility();

  // In case title visibility wasn't changed and only vertical tab strip enabled
  // state changed, we should reset controls positions manually.
  //frame()->ResetWindowControlsPosition();
}
