/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef MISES_CHROMIUM_SRC_BASE_THREADING_THREAD_RESTRICTIONS_H_
#define MISES_CHROMIUM_SRC_BASE_THREADING_THREAD_RESTRICTIONS_H_

class MisesBrowsingDataRemoverDelegate;
namespace ipfs {
class IpfsService;
}
namespace mises {
class ProcessLauncher;
}

#define MISES_SCOPED_ALLOW_BASE_SYNC_PRIMITIVES_H  \
  friend class ::MisesBrowsingDataRemoverDelegate; \
  friend class ipfs::IpfsService;                  \
  friend class mises::ProcessLauncher;

#include "src/base/threading/thread_restrictions.h"
#undef MISES_SCOPED_ALLOW_BASE_SYNC_PRIMITIVES_H

#endif  // MISES_CHROMIUM_SRC_BASE_THREADING_THREAD_RESTRICTIONS_H_
