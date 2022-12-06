
// Copyright 2015 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "chrome/browser/obsolete_system/obsolete_system.h"

// static
bool ObsoleteSystem::IsObsoleteNowOrSoon() {
  return false;
}

// static
std::u16string ObsoleteSystem::LocalizedObsoleteString() {
  return std::u16string();
}

// static
bool ObsoleteSystem::IsEndOfTheLine() {
  return false;
}

// static
const char* ObsoleteSystem::GetLinkURL() {
  return "";
}

