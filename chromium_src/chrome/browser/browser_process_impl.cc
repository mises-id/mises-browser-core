/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "extensions/buildflags/buildflags.h"

#include "mises/browser/profiles/mises_profile_manager.h"

#if BUILDFLAG(ENABLE_EXTENSIONS)
#include "mises/browser/extensions/mises_extensions_browser_client_impl.h"
#define ChromeExtensionsBrowserClient MisesExtensionsBrowserClientImpl
#endif

#include "src/chrome/browser/browser_process_impl.cc"

#if BUILDFLAG(ENABLE_EXTENSIONS)
#undef ChromeExtensionsBrowserClient
#endif
