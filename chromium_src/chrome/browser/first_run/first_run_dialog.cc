// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "chrome/browser/ui/views/first_run_dialog.h"

#if BUILDFLAG(IS_ANDROID)


namespace first_run {

// Shows the first run dialog. Only called for organic first runs on Mac and
// desktop Linux official builds when metrics reporting is not already enabled.
// Invokes ChangeMetricsReportingState() if consent is given to enable crash
// reporting, and may initiate the flow to set the default browser.
void ShowFirstRunDialog(Profile* profile) {

}
void ShowFirstRunDialogViews(Profile* profile) {

}

}  // namespace first_run

#endif

