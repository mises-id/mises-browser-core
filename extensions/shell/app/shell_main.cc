// Copyright 2012 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "build/build_config.h"
#include "content/public/app/content_main.h"
#include "extensions/shell/app/shell_main_delegate.h"


#include "base/at_exit.h"                                 // nogncheck
#include "base/command_line.h"                            // nogncheck
#include "content/public/common/content_switches.h"       // nogncheck
#include "content/shell/app/ios/web_tests_support_ios.h"
#include "content/shell/common/shell_switches.h"
#include "mises/extensions/shell/app/shell_application_ios.h"



int main(int argc, const char** argv) {
  // Create this here since it's needed to start the crash handler.
  base::AtExitManager at_exit;

  // Check if this is the browser process or a subprocess. Only the browser
  // browser should run UIApplicationMain.
  base::CommandLine::Init(argc, argv);
  auto type = base::CommandLine::ForCurrentProcess()->GetSwitchValueASCII(
      switches::kProcessType);

  // The browser process has no --process-type argument.
  if (type.empty()) {
    if (switches::IsRunWebTestsSwitchPresent()) {
      // We create a simple UIApplication to run the web tests.
      return RunWebTestsFromIOSApp(argc, argv);
    } else {
      // We will create the ContentMainRunner once the UIApplication is ready.
      return RunExtensionShellApplication(argc, argv);
    }
  } else {
    extensions::ShellMainDelegate delegate;
    content::ContentMainParams params(&delegate);
    params.argc = argc;
    params.argv = argv;
    return content::ContentMain(std::move(params));
  }
}
