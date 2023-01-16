/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_BROWSER_UI_VIEWS_LOCATION_BAR_BRAVE_LOCATION_BAR_VIEW_H_
#define BRAVE_BROWSER_UI_VIEWS_LOCATION_BAR_BRAVE_LOCATION_BAR_VIEW_H_

#include <vector>

#include "base/gtest_prod_util.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "chrome/browser/ui/views/location_bar/location_bar_view.h"

class SkPath;


#if BUILDFLAG(ENABLE_IPFS)
class IPFSLocationView;
#endif


// The purposes of this subclass are to:
// - Add the BraveActionsContainer to the location bar
class MisesLocationBarView : public LocationBarView {
 public:
  using LocationBarView::LocationBarView;

  MisesLocationBarView(const MisesLocationBarView&) = delete;
  MisesLocationBarView& operator=(const MisesLocationBarView&) = delete;

  void Init() override;
  void Update(content::WebContents* contents) override;
  void OnChanged() override;

#if BUILDFLAG(ENABLE_IPFS)
  IPFSLocationView* GetIPFSLocationView() { return ipfs_location_view_; }
#endif
  // LocationBarView:
  std::vector<views::View*> GetTrailingViews() override;

  ui::ImageModel GetLocationIcon(LocationIconView::Delegate::IconFetchedCallback
                                     on_icon_fetched) const override;

  // views::View:
  gfx::Size CalculatePreferredSize() const override;
  void OnThemeChanged() override;
  void ChildPreferredSizeChanged(views::View* child) override;

  int GetBorderRadius() const override;

  SkPath GetFocusRingHighlightPath() const;
  bool ShouldShowIPFSLocationView() const;


 private:
#if BUILDFLAG(ENABLE_IPFS)
  raw_ptr<IPFSLocationView> ipfs_location_view_ = nullptr;
#endif
};

#endif  // BRAVE_BROWSER_UI_VIEWS_LOCATION_BAR_BRAVE_LOCATION_BAR_VIEW_H_
