/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_BROWSER_PROFILES_BRAVE_RENDERER_UPDATER_FACTORY_H_
#define BRAVE_BROWSER_PROFILES_BRAVE_RENDERER_UPDATER_FACTORY_H_

#include "components/keyed_service/content/browser_context_keyed_service_factory.h"

class Profile;
class MisesRendererUpdater;

namespace base {
template <typename T>
class NoDestructor;
}  // namespace base

// Singleton that creates/deletes MisesRendererUpdater as new Profiles are
// created/shutdown.
class MisesRendererUpdaterFactory : public BrowserContextKeyedServiceFactory {
 public:
  // Returns an instance of the MisesRendererUpdaterFactory singleton.
  static MisesRendererUpdaterFactory* GetInstance();

  // Returns the instance of RendererUpdater for the passed |profile|.
  static MisesRendererUpdater* GetForProfile(Profile* profile);

  MisesRendererUpdaterFactory(const MisesRendererUpdaterFactory&) = delete;
  MisesRendererUpdaterFactory& operator=(const MisesRendererUpdaterFactory&) =
      delete;

 protected:
  // BrowserContextKeyedServiceFactory:
  KeyedService* BuildServiceInstanceFor(
      content::BrowserContext* profile) const override;
  bool ServiceIsCreatedWithBrowserContext() const override;

 private:
  friend base::NoDestructor<MisesRendererUpdaterFactory>;

  content::BrowserContext* GetBrowserContextToUse(
      content::BrowserContext* context) const override;

  MisesRendererUpdaterFactory();
  ~MisesRendererUpdaterFactory() override;
};

#endif  // BRAVE_BROWSER_PROFILES_BRAVE_RENDERER_UPDATER_FACTORY_H_
