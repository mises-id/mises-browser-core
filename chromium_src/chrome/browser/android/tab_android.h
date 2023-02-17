// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef MISES_CHROME_BROWSER_ANDROID_TAB_ANDROID_H_
#define MISES_CHROME_BROWSER_ANDROID_TAB_ANDROID_H_

#define SetDevToolsAgentHost \
  SetExtensionWindowID(const SessionID::id_type& ewid) { extension_window_id_ = ewid; }; \
  const SessionID::id_type& ExtensionWindowID() const { return extension_window_id_; }; \
  void SetExtensionID(const std::string& extid) { extension_id_ = extid; }; \
  const std::string& ExtensionID() const { return extension_id_; }; \
  SessionID::id_type  extension_window_id_ = -1; \
  std::string extension_id_; \
  void SetDevToolsAgentHost

#include "src/chrome/browser/android/tab_android.h"

#undef SetDevToolsAgentHost

#endif
