/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_RENDERER_BRAVE_RENDER_THREAD_OBSERVER_H_
#define BRAVE_RENDERER_BRAVE_RENDER_THREAD_OBSERVER_H_

#include "mises/common/mises_renderer_configuration.mojom.h"
#include "content/public/renderer/render_thread_observer.h"
#include "mojo/public/cpp/bindings/associated_receiver_set.h"
#include "mojo/public/cpp/bindings/pending_associated_receiver.h"
#include "mojo/public/cpp/bindings/pending_receiver.h"
#include "mojo/public/cpp/bindings/receiver.h"

namespace blink {
class AssociatedInterfaceRegistry;
}

class MisesRenderThreadObserver
    : public content::RenderThreadObserver,
      public mises::mojom::MisesRendererConfiguration {
 public:
  MisesRenderThreadObserver(const MisesRenderThreadObserver&) = delete;
  MisesRenderThreadObserver& operator=(const MisesRenderThreadObserver&) =
      delete;
  MisesRenderThreadObserver();
  ~MisesRenderThreadObserver() override;

  bool IsOnionAllowed() const;

  // Return the dynamic parameters - those that may change while the
  // render process is running.
  static const mises::mojom::DynamicParams& GetDynamicParams();

 private:
  // content::RenderThreadObserver:
  void RegisterMojoInterfaces(
      blink::AssociatedInterfaceRegistry* associated_interfaces) override;
  void UnregisterMojoInterfaces(
      blink::AssociatedInterfaceRegistry* associated_interfaces) override;

  // mises::mojom::MisesRendererConfiguration:
  void SetInitialConfiguration(bool is_tor_process) override;
  void SetConfiguration(mises::mojom::DynamicParamsPtr params) override;

  void OnRendererConfigurationAssociatedRequest(
      mojo::PendingAssociatedReceiver<mises::mojom::MisesRendererConfiguration>
          receiver);

  bool is_tor_process_ = false;
  mojo::AssociatedReceiverSet<mises::mojom::MisesRendererConfiguration>
      renderer_configuration_receivers_;
};

#endif  // BRAVE_RENDERER_BRAVE_RENDER_THREAD_OBSERVER_H_
