// Copyright 2019 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
#include "chrome/browser/startup_data.h"
#include "mises/browser/browser_context_keyed_service_factories.h"
#include "chrome/browser/profiles/chrome_browser_main_extra_parts_profiles.h"

#define ChromeBrowserMainExtraPartsProfiles mises

#include "src/chrome/browser/startup_data.cc"

#undef ChromeBrowserMainExtraPartsProfiles

