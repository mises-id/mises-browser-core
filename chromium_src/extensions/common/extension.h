// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef MISES_EXTENSIONS_COMMON_EXTENSION_H_
#define MISES_EXTENSIONS_COMMON_EXTENSION_H_
#define ShouldExposeViaManagementAPI                                                \
  ShouldExposeViaManagementAPI_ChromiumImpl() const; \
  bool ShouldExposeViaManagementAPI

#include "src/extensions/common/extension.h"

#undef ShouldExposeViaManagementAPI

#endif  // EXTENSIONS_COMMON_EXTENSION_H_
