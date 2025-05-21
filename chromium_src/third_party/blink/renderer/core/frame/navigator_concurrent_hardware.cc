// Copyright 2014 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "third_party/blink/renderer/core/frame/navigator_concurrent_hardware.h"

#include "base/system/sys_info.h"

#include "base/command_line.h"
#include "components/ungoogled/ungoogled_switches.h"
 

namespace blink {

unsigned NavigatorConcurrentHardware::hardwareConcurrency() const {

  const base::CommandLine* command_line = base::CommandLine::ForCurrentProcess();
  if (command_line->HasSwitch(switches::kFingerprintHardwareConcurrency)) {
    std::string value = command_line->GetSwitchValueASCII(switches::kFingerprintHardwareConcurrency);
    unsigned long custom_concurrency = std::stoul(value);
    return static_cast<unsigned>(custom_concurrency);
  }

  if (command_line->HasSwitch(switches::kFingerprint)) {
    std::string fingerprint_str = command_line->GetSwitchValueASCII(switches::kFingerprint);
    uint64_t fingerprint = std::stoull(fingerprint_str);
    return static_cast<unsigned>((fingerprint % 16) * 2);
  }

  return static_cast<unsigned>(base::SysInfo::NumberOfProcessors());
}

}  // namespace blink
