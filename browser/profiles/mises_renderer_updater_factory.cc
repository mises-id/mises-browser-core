/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/profiles/mises_renderer_updater_factory.h"

#include "base/no_destructor.h"
#include "mises/browser/brave_wallet/keyring_service_factory.h"
#include "mises/browser/profiles/mises_renderer_updater.h"
#include "chrome/browser/browser_process.h"
#include "chrome/browser/profiles/incognito_helpers.h"
#include "chrome/browser/profiles/profile.h"
#include "components/keyed_service/content/browser_context_dependency_manager.h"

MisesRendererUpdaterFactory::MisesRendererUpdaterFactory()
    : BrowserContextKeyedServiceFactory(
          "MisesRendererUpdater",
          BrowserContextDependencyManager::GetInstance()) {
  DependsOn(brave_wallet::KeyringServiceFactory::GetInstance());
}

MisesRendererUpdaterFactory::~MisesRendererUpdaterFactory() = default;

// static
MisesRendererUpdaterFactory* MisesRendererUpdaterFactory::GetInstance() {
  static base::NoDestructor<MisesRendererUpdaterFactory> instance;
  return instance.get();
}

// static
MisesRendererUpdater* MisesRendererUpdaterFactory::GetForProfile(
    Profile* profile) {
  return static_cast<MisesRendererUpdater*>(
      GetInstance()->GetServiceForBrowserContext(profile, true));
}

KeyedService* MisesRendererUpdaterFactory::BuildServiceInstanceFor(
    content::BrowserContext* context) const {
  auto* keyring_service =
      brave_wallet::KeyringServiceFactory::GetServiceForContext(context);
  return new MisesRendererUpdater(static_cast<Profile*>(context),
                                  keyring_service,
                                  g_browser_process->local_state());
}

bool MisesRendererUpdaterFactory::ServiceIsCreatedWithBrowserContext() const {
  return true;
}

content::BrowserContext* MisesRendererUpdaterFactory::GetBrowserContextToUse(
    content::BrowserContext* context) const {
  return chrome::GetBrowserContextRedirectedInIncognito(context);
}
