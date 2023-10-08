// Copyright (c) 2019 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

#include "build/build_config.h"
#include "extensions/buildflags/buildflags.h"

#if BUILDFLAG(IS_ANDROID)
#include "ui/native_theme/native_theme.h"
#include "content/public/browser/web_contents.h"

// namespace webui {
// ui::NativeTheme* GetNativeTheme(content::WebContents* web_contents) {
//   return ui::NativeTheme::GetInstanceForNativeUi();
// }
// }  // namespace webui


#endif  // #if BUILDFLAG(IS_ANDROID)

#include "src/chrome/browser/ui/webui/favicon_source.cc"

