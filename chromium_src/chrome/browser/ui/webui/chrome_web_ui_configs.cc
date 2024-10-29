/* Copyright (c) 2024 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

#include "chrome/browser/ui/webui/chrome_web_ui_configs.h"

#include "content/public/browser/webui_config_map.h"

#define RegisterChromeWebUIConfigs RegisterChromeWebUIConfigs_ChromiumImpl

#include "src/chrome/browser/ui/webui/chrome_web_ui_configs.cc"
#undef RegisterChromeWebUIConfigs

#if BUILDFLAG(IS_ANDROID)
#include "mises/browser/ui/webui/brave_wallet/wallet_panel_ui.h"
//#include "mises/browser/ui/webui/speedreader/speedreader_toolbar_ui.h"
#include "chrome/browser/ui/webui/tab_search/tab_search_ui.h"
#endif  // !BUILDFLAG(IS_ANDROID)

void RegisterChromeWebUIConfigs() {
  RegisterChromeWebUIConfigs_ChromiumImpl();

#if BUILDFLAG(IS_ANDROID)
  auto& map = content::WebUIConfigMap::GetInstance();
  map.AddWebUIConfig(std::make_unique<WalletPanelUIConfig>());
//  map.AddWebUIConfig(std::make_unique<SpeedreaderToolbarUIConfig>());
  map.AddWebUIConfig(std::make_unique<TabSearchUIConfig>());
#endif  // !BUILDFLAG(IS_ANDROID)
}
