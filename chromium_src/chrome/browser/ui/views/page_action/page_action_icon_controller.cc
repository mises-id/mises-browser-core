#include "build/build_config.h"

#if !BUILDFLAG(IS_ANDROID)
#include "src/chrome/browser/ui/views/page_action/page_action_icon_controller.cc"

#else
#include "chrome/browser/ui/views/page_action/page_action_icon_controller.h"


#include <algorithm>

#include "base/bind.h"
#include "base/feature_list.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/sharing/click_to_call/click_to_call_ui_controller.h"
#include "chrome/browser/sharing/sms/sms_remote_fetcher_ui_controller.h"
#include "chrome/browser/ui/browser.h"
#include "chrome/common/chrome_features.h"
#include "content/public/common/content_features.h"
#include "ui/views/animation/ink_drop.h"
#include "ui/views/layout/box_layout.h"

PageActionIconController::PageActionIconController() = default;
PageActionIconController::~PageActionIconController() = default;

void PageActionIconController::Init(const PageActionIconParams& params,
                                    PageActionIconContainer* icon_container) {
}


PageActionIconView* PageActionIconController::GetIconView(
    PageActionIconType type) {
  auto result = page_action_icon_views_.find(type);
  return result != page_action_icon_views_.end() ? result->second : nullptr;
}

void PageActionIconController::UpdateAll() {
  for (auto icon_item : page_action_icon_views_)
    icon_item.second->Update();
}

bool PageActionIconController::IsAnyIconVisible() const {
  return std::any_of(
      page_action_icon_views_.begin(), page_action_icon_views_.end(),
      [](auto icon_item) { return icon_item.second->GetVisible(); });
}

bool PageActionIconController::ActivateFirstInactiveBubbleForAccessibility() {
 
  return false;
}

void PageActionIconController::SetIconColor(SkColor icon_color) {
  for (auto icon_item : page_action_icon_views_)
    icon_item.second->SetIconColor(icon_color);
}

void PageActionIconController::SetFontList(const gfx::FontList& font_list) {
  for (auto icon_item : page_action_icon_views_)
    icon_item.second->SetFontList(font_list);
}

void PageActionIconController::ZoomChangedForActiveTab(bool can_show_bubble) {

}

std::vector<const PageActionIconView*>
PageActionIconController::GetPageActionIconViewsForTesting() const {
  std::vector<const PageActionIconView*> icon_views;
  std::transform(page_action_icon_views_.cbegin(),
                 page_action_icon_views_.cend(), std::back_inserter(icon_views),
                 [](auto const& item) { return item.second; });
  return icon_views;
}

void PageActionIconController::OnDefaultZoomLevelChanged() {
  ZoomChangedForActiveTab(false);
}


#endif
