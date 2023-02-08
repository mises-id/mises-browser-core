/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "extensions/buildflags/buildflags.h"

#if BUILDFLAG(ENABLE_EXTENSIONS)
#include "mises/browser/ui/views/location_bar/mises_location_bar_view.h"
#include "chrome/browser/ui/views/location_bar/location_bar_view.h"

#define LocationBarView MisesLocationBarView
#endif

#include "src/chrome/browser/ui/views/toolbar/toolbar_view.cc"

#if BUILDFLAG(ENABLE_EXTENSIONS)
#undef LocationBarView
#endif
