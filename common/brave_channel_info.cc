/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/common/brave_channel_info.h"

#include "chrome/common/channel_info.h"
#include "components/version_info/channel.h"

namespace brave {

std::string GetChannelName() {
#if defined(OFFICIAL_BUILD)
  std::string channel_name =
      chrome::GetChannelName(chrome::WithExtendedStable(false));
  if (channel_name.empty()) {
    channel_name = "release";
  }

  return channel_name;
#else  // OFFICIAL_BUILD
  return "developer";
#endif  // !OFFICIAL_BUILD
}

}  // namespace brave
