#include "src/chrome/browser/first_run/first_run_internal_posix.cc"
#if BUILDFLAG(IS_ANDROID)

namespace first_run {

// Shows the first run dialog. Only called for organic first runs on Mac and
// desktop Linux official builds when metrics reporting is not already enabled.
// Invokes ChangeMetricsReportingState() if consent is given to enable crash
// reporting, and may initiate the flow to set the default browser.
void ShowFirstRunDialog() {

}

}  // namespace first_run

#endif