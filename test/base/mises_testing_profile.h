/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_TEST_BASE_BRAVE_TESTING_PROFILE_H_
#define BRAVE_TEST_BASE_BRAVE_TESTING_PROFILE_H_

#include "chrome/test/base/testing_profile.h"

class MisesTestingProfile : public TestingProfile {
 public:
  MisesTestingProfile();
  MisesTestingProfile(const base::FilePath& path, Delegate* delegate);
  ~MisesTestingProfile() override = default;
};

#endif  // BRAVE_TEST_BASE_BRAVE_TESTING_PROFILE_H_
