/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/mises_browser_process.h"

#include <cstddef>

MisesBrowserProcess* g_mises_browser_process = nullptr;

MisesBrowserProcess::MisesBrowserProcess() = default;

MisesBrowserProcess::~MisesBrowserProcess() = default;
