/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_BROWSER_EXTENSIONS_BRAVE_COMPONENT_LOADER_H_
#define BRAVE_BROWSER_EXTENSIONS_BRAVE_COMPONENT_LOADER_H_

#include <string>

#include "base/files/file_path.h"
#include "base/memory/raw_ptr.h"
#include "chrome/browser/extensions/component_loader.h"

class PrefService;
class Profile;

namespace extensions {

// For registering, loading, and unloading component extensions.
class MisesComponentLoader : public ComponentLoader {
 public:
  MisesComponentLoader(ExtensionSystem* extension_system,
                       Profile* browser_context);
  MisesComponentLoader(const MisesComponentLoader&) = delete;
  MisesComponentLoader& operator=(const MisesComponentLoader&) = delete;
  ~MisesComponentLoader() override;

  // Adds the default component extensions. If |skip_session_components|
  // the loader will skip loading component extensions that weren't supposed to
  // be loaded unless we are in signed user session (ChromeOS). For all other
  // platforms this |skip_session_components| is expected to be unset.
  void AddDefaultComponentExtensions(bool skip_session_components) override;
  void OnComponentRegistered(std::string extension_id);

  void OnComponentReady(std::string extension_id,
    bool allow_file_access,
    const base::FilePath& install_dir,
    const std::string& manifest);
  void AddExtension(const std::string& id,
      const std::string& name, const std::string& public_key);
  // ForceAddHangoutServicesExtension ignores whether or not a preference for
  // hangouts is set.  If the buildflag is not set, it won't add though.
  void ForceAddHangoutServicesExtension();

 private:

  void ReinstallAsNonComponent(std::string extension_id);

  raw_ptr<Profile> profile_ = nullptr;
  raw_ptr<PrefService> profile_prefs_ = nullptr;
};

}  // namespace extensions

#endif  // BRAVE_BROWSER_EXTENSIONS_BRAVE_COMPONENT_LOADER_H_
