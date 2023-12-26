/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/renderer/mises_render_thread_observer.h"

#include <utility>

#include "base/logging.h"
#include "base/no_destructor.h"
#include "third_party/blink/public/common/associated_interfaces/associated_interface_registry.h"

namespace {

mises::mojom::DynamicParams* GetDynamicConfigParams() {
  static base::NoDestructor<mises::mojom::DynamicParams> dynamic_params;
  return dynamic_params.get();
}

}  // namespace

MisesRenderThreadObserver::MisesRenderThreadObserver() = default;

MisesRenderThreadObserver::~MisesRenderThreadObserver() = default;

// static
const mises::mojom::DynamicParams&
MisesRenderThreadObserver::GetDynamicParams() {
  return *GetDynamicConfigParams();
}

void MisesRenderThreadObserver::RegisterMojoInterfaces(
    blink::AssociatedInterfaceRegistry* associated_interfaces) {
  associated_interfaces->AddInterface<mises::mojom::MisesRendererConfiguration>(
      base::BindRepeating(
          &MisesRenderThreadObserver::OnRendererConfigurationAssociatedRequest,
          base::Unretained(this)));
}

void MisesRenderThreadObserver::UnregisterMojoInterfaces(
    blink::AssociatedInterfaceRegistry* associated_interfaces) {
  associated_interfaces->RemoveInterface(
      mises::mojom::MisesRendererConfiguration::Name_);
}

void MisesRenderThreadObserver::OnRendererConfigurationAssociatedRequest(
    mojo::PendingAssociatedReceiver<mises::mojom::MisesRendererConfiguration>
        receiver) {
  renderer_configuration_receivers_.Add(this, std::move(receiver));
}

void MisesRenderThreadObserver::SetInitialConfiguration(bool is_tor_process) {
  is_tor_process_ = is_tor_process;
}

void MisesRenderThreadObserver::SetConfiguration(
    mises::mojom::DynamicParamsPtr params) {
  *GetDynamicConfigParams() = std::move(*params);
}

bool MisesRenderThreadObserver::IsOnionAllowed() const {
  return is_tor_process_ ||
         !GetDynamicConfigParams()->onion_only_in_tor_windows;
}
