/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/installer/util/mises_shell_util.h"

#include "base/notreached.h"
#include "chrome/install_static/install_util.h"
#include "components/version_info/channel.h"

namespace installer {

std::wstring GetProgIdForFileType() {
  switch (install_static::GetChromeChannel()) {
    case version_info::Channel::STABLE:
      return L"MisesFile";
    case version_info::Channel::BETA:
      return L"MisesBFile";
    case version_info::Channel::DEV:
      return L"MisesDFile";
    case version_info::Channel::CANARY:
      return L"MisesSFile";
    default:
     NOTREACHED_IN_MIGRATION();
      return L"MisesFile";
  }
}

bool ShouldUseFileTypeProgId(const std::wstring& ext) {
  return (ext == L".pdf" || ext == L".svg");
}

}  // namespace installer
