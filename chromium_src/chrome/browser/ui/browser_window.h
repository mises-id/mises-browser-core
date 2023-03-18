#ifndef MISES_BROWSER_UI_BROWSER_WINDOW_H_
#define MISES_BROWSER_UI_BROWSER_WINDOW_H_

#include <memory>
#include <string>
#include <vector>

#include "base/functional/callback_forward.h"
#include "base/functional/callback_helpers.h"
#include "build/build_config.h"
#include "build/chromeos_buildflags.h"
#include "chrome/browser/apps/intent_helper/apps_navigation_types.h"
#include "chrome/browser/lifetime/browser_close_manager.h"
#include "chrome/browser/share/share_attempt.h"
#include "chrome/browser/signin/chrome_signin_helper.h"
#include "chrome/browser/translate/chrome_translate_client.h"
#include "chrome/browser/ui/bookmarks/bookmark_bar.h"
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/browser_dialogs.h"
#include "chrome/browser/ui/exclusive_access/exclusive_access_bubble_type.h"
#include "chrome/browser/ui/hats/hats_service.h"
#include "chrome/browser/ui/page_action/page_action_icon_type.h"
#include "chrome/browser/ui/translate/partial_translate_bubble_model.h"
#include "chrome/common/buildflags.h"
#include "components/strings/grit/components_strings.h"
#include "components/content_settings/core/common/content_settings_types.h"
#include "components/translate/core/common/translate_errors.h"
#include "components/user_education/common/feature_promo_controller.h"
#include "components/user_education/common/feature_promo_specification.h"
#include "third_party/abseil-cpp/absl/types/optional.h"
#include "ui/base/base_window.h"
#include "ui/base/interaction/element_identifier.h"
#include "ui/base/window_open_disposition.h"
#include "ui/gfx/native_widget_types.h"
#include "url/origin.h"



#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/browser_window.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/ui/browser_window.h"


#endif

#endif  // CHROME_BROWSER_UI_BROWSER_WINDOW_H_
