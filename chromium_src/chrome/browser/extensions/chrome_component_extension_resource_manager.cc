/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

#include "chrome/browser/extensions/chrome_component_extension_resource_manager.h"

#include "mises/components/mises_extension/grit/mises_extension_resources_map.h"



#define MISES_CHROME_COMPONENT_EXTENSION_RESOURCE_MANAGER_DATA_DATA  \
  AddComponentResourceEntries(kMisesExtension, kMisesExtensionSize);       

#include "src/chrome/browser/extensions/chrome_component_extension_resource_manager.cc"
#undef MISES_CHROME_COMPONENT_EXTENSION_RESOURCE_MANAGER_DATA_DATA
