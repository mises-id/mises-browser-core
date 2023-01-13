/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/mises_component_updater/browser/mises_component.h"

#include <utility>

#include "base/bind.h"
#include "base/logging.h"
#include "base/task/sequenced_task_runner.h"

namespace mises_component_updater {

MisesComponent::MisesComponent(Delegate* delegate)
    : delegate_(delegate),
      weak_factory_(this) {}

MisesComponent::~MisesComponent() = default;

void MisesComponent::Register(const std::string& component_name,
                              const std::string& component_id,
                              const std::string& component_base64_public_key) {
  VLOG(2) << "register component: " << component_id;
  if (!delegate_) {
    return;
  }
  component_name_ = component_name;
  component_id_ = component_id;
  component_base64_public_key_ = component_base64_public_key;

  auto registered_callback =
      base::BindOnce(&MisesComponent::OnComponentRegistered,
                     delegate_,
                     component_id);
  auto ready_callback =
      base::BindRepeating(&MisesComponent::OnComponentReadyInternal,
                          weak_factory_.GetWeakPtr(),
                          component_id);

  delegate_->Register(component_name_,
                      component_base64_public_key_,
                      std::move(registered_callback),
                      ready_callback);
}

bool MisesComponent::Unregister() {
  VLOG(2) << "unregister component: " << component_id_;
  if (!delegate_) {
    return false;
  }
  return delegate_->Unregister(component_id_);
}

scoped_refptr<base::SequencedTaskRunner> MisesComponent::GetTaskRunner() {
  return delegate_->GetTaskRunner();
}

void MisesComponent::AddObserver(ComponentObserver* observer) {
  DCHECK(delegate_);
  delegate_->AddObserver(observer);
}

void MisesComponent::RemoveObserver(ComponentObserver* observer) {
  DCHECK(delegate_);
  delegate_->RemoveObserver(observer);
}

void MisesComponent::OnComponentReadyInternal(
    const std::string& component_id,
    const base::FilePath& install_dir,
    const std::string& manifest) {
  VLOG(2) << "component ready: " << manifest;
  OnComponentReady(component_id, install_dir, manifest);
}

void MisesComponent::OnComponentReady(
    const std::string& component_id,
    const base::FilePath& install_dir,
    const std::string& manifest) {}

// static
void MisesComponent::OnComponentRegistered(
    Delegate* delegate,
    const std::string& component_id) {
  VLOG(2) << "component registered: " << component_id;
  delegate->OnDemandUpdate(component_id);
}

MisesComponent::Delegate* MisesComponent::delegate() {
  return delegate_;
}

}  // namespace brave_component_updater
