#include "chrome/browser/ui/views/first_run_dialog.h"

#if BUILDFLAG(IS_ANDROID)

namespace first_run {

// Shows the first run dialog. Only called for organic first runs on Mac and
// desktop Linux official builds when metrics reporting is not already enabled.
// Invokes ChangeMetricsReportingState() if consent is given to enable crash
// reporting, and may initiate the flow to set the default browser.
void ShowFirstRunDialog() {
}
void ShowFirstRunDialogViews() {

}

}  // namespace first_run


#else

#include "src/chrome/browser/ui/views/first_run_dialog.cc"

#endif

