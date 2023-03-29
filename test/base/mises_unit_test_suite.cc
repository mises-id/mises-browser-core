/* Copyright (c) 2018 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/test/base/mises_unit_test_suite.h"

#include "base/logging.h"
#include "mises/common/resource_bundle_helper.h"
#include "mises/components/constants/mises_paths.h"
#include "build/build_config.h"
#include "chrome/install_static/product_install_details.h"
#include "chrome/test/base/chrome_unit_test_suite.h"

MisesUnitTestSuite::MisesUnitTestSuite(int argc, char** argv)
    : ChromeUnitTestSuite(argc, argv) {}

void MisesUnitTestSuite::Initialize() {
#if BUILDFLAG(IS_WIN) && defined(OFFICIAL_BUILD)
  // When ChromeExtensionsBrowserClient is initialized, it needs
  install_static::InitializeProductDetailsForPrimaryModule();
#endif
  ChromeUnitTestSuite::Initialize();

  mises::InitializeResourceBundle();

  mises::RegisterPathProvider();
}
