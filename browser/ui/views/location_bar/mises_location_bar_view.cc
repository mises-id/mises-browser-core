/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/ui/views/location_bar/mises_location_bar_view.h"

#include <memory>
#include <utility>

#include "base/feature_list.h"
#include "mises/browser/profiles/profile_util.h"
#include "mises/components/l10n/common/localization_util.h"
#include "mises/grit/mises_theme_resources.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/themes/theme_service_factory.h"
#include "chrome/browser/ui/layout_constants.h"
#include "chrome/browser/ui/omnibox/omnibox_theme.h"
#include "chrome/browser/ui/views/chrome_layout_provider.h"
#include "chrome/browser/ui/views/location_bar/location_bar_view.h"
#include "chrome/browser/ui/views/omnibox/omnibox_view_views.h"
#include "chrome/grit/chromium_strings.h"
#include "components/grit/mises_components_strings.h"
#include "components/omnibox/browser/omnibox_edit_model.h"
#include "components/version_info/channel.h"
#include "content/public/browser/navigation_entry.h"
#include "third_party/abseil-cpp/absl/types/optional.h"
#include "ui/base/resource/resource_bundle.h"
#include "ui/gfx/geometry/size.h"
#include "ui/gfx/geometry/skia_conversions.h"
#include "ui/gfx/image/image_skia.h"
#include "ui/gfx/paint_vector_icon.h"
#include "ui/views/controls/highlight_path_generator.h"
#include "chrome/browser/ui/browser.h"

#if BUILDFLAG(ENABLE_IPFS)
#include "mises/browser/ipfs/ipfs_service_factory.h"
#include "mises/browser/ui/views/location_bar/ipfs_location_view.h"
#include "mises/components/ipfs/ipfs_constants.h"
#include "mises/components/ipfs/ipfs_utils.h"
#endif

namespace {

class MisesLocationBarViewFocusRingHighlightPathGenerator
    : public views::HighlightPathGenerator {
 public:
  MisesLocationBarViewFocusRingHighlightPathGenerator() = default;
  MisesLocationBarViewFocusRingHighlightPathGenerator(
      const MisesLocationBarViewFocusRingHighlightPathGenerator&) = delete;
  MisesLocationBarViewFocusRingHighlightPathGenerator& operator=(
      const MisesLocationBarViewFocusRingHighlightPathGenerator&) = delete;

  // HighlightPathGenerator
  SkPath GetHighlightPath(const views::View* view) override {
    return static_cast<const MisesLocationBarView*>(view)
        ->GetFocusRingHighlightPath();
  }
};


}  // namespace

void MisesLocationBarView::Init() {
  // base method calls Update and Layout
  LocationBarView::Init();
#if BUILDFLAG(ENABLE_IPFS)
  ipfs_location_view_ =
      AddChildView(std::make_unique<IPFSLocationView>(browser_->profile()));
#endif

  // Call Update again to cause a Layout
  Update(nullptr);

  // Stop slide animation for all content settings views icon.
  for (auto* content_setting_view : content_setting_views_)
    content_setting_view->disable_animation();
}

bool MisesLocationBarView::ShouldShowIPFSLocationView() const {
#if BUILDFLAG(ENABLE_IPFS)
  const GURL& url = GetLocationBarModel()->GetURL();
  if (!ipfs::IpfsServiceFactory::IsIpfsEnabled(profile_) ||
      !ipfs::IsIPFSScheme(url) ||
      !ipfs::IsLocalGatewayConfigured(profile_->GetPrefs()))
    return false;

  return true;
#else
  return false;
#endif
}

void MisesLocationBarView::Update(content::WebContents* contents) {
  // base Init calls update before our Init is run, so our children
  // may not be initialized yet

#if BUILDFLAG(ENABLE_IPFS)
  if (ipfs_location_view_)
    ipfs_location_view_->Update(contents);
#endif

  LocationBarView::Update(contents);

  if (ShouldShowIPFSLocationView()) {
    // Secure display text for a page was set by chromium.
    // We do not want to override this.
    if (!GetLocationBarModel()->GetSecureDisplayText().empty())
      return;
    auto badge_text =
        brave_l10n::GetLocalizedResourceUTF16String(IDS_IPFS_BADGE_TITLE);
    location_icon_view()->SetLabel(badge_text);
  }

}

ui::ImageModel MisesLocationBarView::GetLocationIcon(
    LocationIconView::Delegate::IconFetchedCallback on_icon_fetched) const {
  if (!ShouldShowIPFSLocationView() ||
      !omnibox_view_->model()->ShouldShowCurrentPageIcon())
    return LocationBarView::GetLocationIcon(std::move(on_icon_fetched));

  auto& bundle = ui::ResourceBundle::GetSharedInstance();
  const auto& ipfs_logo = *bundle.GetImageSkiaNamed(IDR_BRAVE_IPFS_LOGO);
  return ui::ImageModel::FromImageSkia(ipfs_logo);
}

void MisesLocationBarView::OnChanged() {
#if BUILDFLAG(ENABLE_IPFS)
  if (ipfs_location_view_)
    ipfs_location_view_->Update(
        browser_->tab_strip_model()->GetActiveWebContents());
#endif

  // OnChanged calls Layout
  LocationBarView::OnChanged();
}

std::vector<views::View*> MisesLocationBarView::GetTrailingViews() {
  std::vector<views::View*> views;

#if BUILDFLAG(ENABLE_IPFS)
  if (ipfs_location_view_)
    views.push_back(ipfs_location_view_);
#endif


  return views;
}

gfx::Size MisesLocationBarView::CalculatePreferredSize() const {
  gfx::Size min_size = LocationBarView::CalculatePreferredSize();

#if BUILDFLAG(ENABLE_IPFS)
  if (ipfs_location_view_ && ipfs_location_view_->GetVisible()) {
    const int extra_width = GetLayoutConstant(LOCATION_BAR_ELEMENT_PADDING) +
                            ipfs_location_view_->GetMinimumSize().width();
    min_size.Enlarge(extra_width, 0);
  }
#endif

  return min_size;
}

void MisesLocationBarView::OnThemeChanged() {
  LocationBarView::OnThemeChanged();

  if (!IsInitialized())
    return;

  Update(nullptr);
  RefreshBackground();
}

void MisesLocationBarView::ChildPreferredSizeChanged(views::View* child) {
  LocationBarView::ChildPreferredSizeChanged(child);

  Layout();
}

int MisesLocationBarView::GetBorderRadius() const {
  return ChromeLayoutProvider::Get()->GetCornerRadiusMetric(
      views::Emphasis::kHigh, size());
}

SkPath MisesLocationBarView::GetFocusRingHighlightPath() const {
  const SkScalar radius = GetBorderRadius();
  return SkPath().addRoundRect(gfx::RectToSkRect(GetLocalBounds()), radius,
                               radius);
}

