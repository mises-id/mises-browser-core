/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef MISES_CHROMIUM_SRC_COMPONENTS_COMPONENT_UPDATER_COMPONENT_UPDATER_SERVICE_H_
#define MISES_CHROMIUM_SRC_COMPONENTS_COMPONENT_UPDATER_COMPONENT_UPDATER_SERVICE_H_

class IPFSDOMHandler;

#define MISES_COMPONENT_UPDATER_SERVICE_H_ friend class ::IPFSDOMHandler;
#define MISES_COMPONENT_UPDATER_SERVICE_H_ON_DEMAND_UPDATER \
 private:                                                   \
  friend void MisesOnDemandUpdate(const std::string&);      \
                                                            \
 public:
#include "src/components/component_updater/component_updater_service.h"

#endif  // MISES_CHROMIUM_SRC_COMPONENTS_COMPONENT_UPDATER_COMPONENT_UPDATER_SERVICE_H_
