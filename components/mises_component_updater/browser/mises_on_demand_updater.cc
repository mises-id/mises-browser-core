/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/mises_component_updater/browser/mises_on_demand_updater.h"

#include <string>

#include "base/memory/singleton.h"

namespace mises_component_updater {

MisesOnDemandUpdater* MisesOnDemandUpdater::GetInstance() {
  return base::Singleton<MisesOnDemandUpdater>::get();
}

MisesOnDemandUpdater::MisesOnDemandUpdater() = default;

MisesOnDemandUpdater::~MisesOnDemandUpdater() = default;

void MisesOnDemandUpdater::OnDemandUpdate(const std::string& id) {
  DCHECK(!on_demand_update_callback_.is_null());
  on_demand_update_callback_.Run(id);
}

void MisesOnDemandUpdater::RegisterOnDemandUpdateCallback(Callback callback) {
  on_demand_update_callback_ = callback;
}


}  // namespace brave_component_updater
