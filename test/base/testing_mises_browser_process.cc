/* Copyright (c) 2021 The Brave Software Team. Distributed under the MPL2
 * license. This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/test/base/testing_mises_browser_process.h"

#include <utility>
#include "base/check.h"
//#include "mises/components/brave_shields/browser/ad_block_service.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
//#include "brave/components/tor/buildflags/buildflags.h"

namespace ipfs {
class MisesIpfsClientUpdater;
}

// static
TestingMisesBrowserProcess* TestingMisesBrowserProcess::GetGlobal() {
  return static_cast<TestingMisesBrowserProcess*>(g_mises_browser_process);
}

// static
void TestingMisesBrowserProcess::CreateInstance() {
  DCHECK(!g_mises_browser_process);
  TestingMisesBrowserProcess* process = new TestingMisesBrowserProcess;
  g_mises_browser_process = process;
}

// static
void TestingMisesBrowserProcess::DeleteInstance() {
  MisesBrowserProcess* browser_process = g_mises_browser_process;
  g_mises_browser_process = nullptr;
  delete browser_process;
}

TestingMisesBrowserProcess::TestingMisesBrowserProcess() = default;

TestingMisesBrowserProcess::~TestingMisesBrowserProcess() = default;

void TestingMisesBrowserProcess::StartMisesServices() {}


#if BUILDFLAG(ENABLE_IPFS)
ipfs::MisesIpfsClientUpdater*
TestingMisesBrowserProcess::ipfs_client_updater() {
  return nullptr;
}
#endif


///////////////////////////////////////////////////////////////////////////////

TestingMisesBrowserProcessInitializer::TestingMisesBrowserProcessInitializer() {
  TestingMisesBrowserProcess::CreateInstance();
}

TestingMisesBrowserProcessInitializer::
    ~TestingMisesBrowserProcessInitializer() {
  TestingMisesBrowserProcess::DeleteInstance();
}
