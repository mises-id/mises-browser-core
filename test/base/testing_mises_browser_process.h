/* Copyright (c) 2021 The Brave Software Team. Distributed under the MPL2
 * license. This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// An implementation of MisesBrowserProcess for unit tests that fails for most
// services. By preventing creation of services, we reduce dependencies and
// keep the profile clean. Clients of this class must handle the NULL return
// value, however.

#ifndef BRAVE_TEST_BASE_TESTINg_mises_browser_process_H_
#define BRAVE_TEST_BASE_TESTINg_mises_browser_process_H_

#include <stdint.h>

#include <memory>
#include <string>

#include "mises/browser/mises_browser_process.h"


class TestingMisesBrowserProcess : public MisesBrowserProcess {
 public:
  // Initializes |g_mises_browser_process| with a new
  // TestingMisesBrowserProcess.
  static void CreateInstance();

  // Cleanly destroys |g_mises_browser_process|.
  static void DeleteInstance();

  // Convenience method to get g_mises_browser_process as a
  // TestingMisesBrowserProcess*.
  static TestingMisesBrowserProcess* GetGlobal();

  TestingMisesBrowserProcess(const TestingMisesBrowserProcess&) = delete;
  TestingMisesBrowserProcess& operator=(const TestingMisesBrowserProcess&) =
      delete;

  // MisesBrowserProcess overrides:
  void StartMisesServices() override;
#if BUILDFLAG(ENABLE_IPFS)
  ipfs::MisesIpfsClientUpdater* ipfs_client_updater() override;
#endif

 private:
  // See CreateInstance() and DestroyInstance() above.
  TestingMisesBrowserProcess();
  ~TestingMisesBrowserProcess() override;
};

class TestingMisesBrowserProcessInitializer {
 public:
  TestingMisesBrowserProcessInitializer();
  TestingMisesBrowserProcessInitializer(
      const TestingMisesBrowserProcessInitializer&) = delete;
  TestingMisesBrowserProcessInitializer& operator=(
      const TestingMisesBrowserProcessInitializer&) = delete;
  ~TestingMisesBrowserProcessInitializer();
};

#endif  // BRAVE_TEST_BASE_TESTINg_mises_browser_process_H_
