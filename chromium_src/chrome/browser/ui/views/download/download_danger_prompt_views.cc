
#include "build/build_config.h"
#include "chrome/browser/download/download_item_model.h"
#include "chrome/browser/download/download_ui_safe_browsing_util.h"
#include "base/compiler_specific.h"
#include "base/feature_list.h"
#include "base/memory/raw_ptr.h"
#include "base/notreached.h"
#include "base/strings/utf_string_conversions.h"
#include "chrome/browser/download/download_danger_prompt.h"
#include "chrome/browser/download/download_stats.h"
#include "chrome/browser/download/download_ui_safe_browsing_util.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/safe_browsing/advanced_protection_status_manager.h"
#include "chrome/browser/safe_browsing/advanced_protection_status_manager_factory.h"
#include "chrome/browser/ui/bookmarks/bookmark_editor.h"
#include "chrome/browser/ui/hats/trust_safety_sentiment_service.h"
#include "chrome/browser/ui/hats/trust_safety_sentiment_service_factory.h"
#include "chrome/browser/ui/views/chrome_layout_provider.h"
#include "chrome/grit/branded_strings.h"
#include "chrome/grit/generated_resources.h"
#include "components/constrained_window/constrained_window_views.h"
#include "components/download/public/common/download_danger_type.h"
#include "components/download/public/common/download_item.h"
#include "components/safe_browsing/core/common/features.h"
#include "components/safe_browsing/core/common/safe_browsing_prefs.h"
#include "components/strings/grit/components_strings.h"
#include "content/public/browser/browser_context.h"
#include "content/public/browser/browser_thread.h"
#include "content/public/browser/download_item_utils.h"
#include "content/public/browser/web_contents.h"
#include "ui/base/buildflags.h"
#include "ui/base/l10n/l10n_util.h"
#include "ui/base/metadata/metadata_header_macros.h"
#include "ui/base/metadata/metadata_impl_macros.h"
#include "ui/base/mojom/ui_base_types.mojom-shared.h"
#include "ui/base/resource/resource_bundle.h"
#include "ui/views/controls/label.h"
#include "ui/views/layout/fill_layout.h"
#include "ui/views/window/dialog_delegate.h"
#include "url/gurl.h"


#if !BUILDFLAG(FULL_SAFE_BROWSING)
namespace {
    void SendSafeBrowsingDownloadReport_unused(safe_browsing::ClientSafeBrowsingReportRequest::ReportType) {

    }
}
#define SendSafeBrowsingDownloadReport(A, B, C) SendSafeBrowsingDownloadReport_unused(A)
#include "src/chrome/browser/ui/views/download/download_danger_prompt_views.cc"
#undef SendSafeBrowsingDownloadReport
#else
#include "src/chrome/browser/ui/views/download/download_danger_prompt_views.cc"
#endif



#if BUILDFLAG(IS_ANDROID)
void DownloadDangerPrompt::RecordDownloadWarningEvent(
    Action action,
    download::DownloadItem* download) {

}
#endif
