// Copyright (c) 2020 The ungoogled-chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Defines all the fingerprinting command-line switches.

#ifndef THIRD_PARTY_UNGOOGLED_FINGERPRINTING_SWITCHES_H_
#define THIRD_PARTY_UNGOOGLED_FINGERPRINTING_SWITCHES_H_

#include "base/component_export.h"

namespace switches {

COMPONENT_EXPORT(UNGOOGLED) extern const char kFingerprintingClientRectsNoise[];
COMPONENT_EXPORT(UNGOOGLED) extern const char kFingerprintingCanvasMeasureTextNoise[];
COMPONENT_EXPORT(UNGOOGLED) extern const char kFingerprintingCanvasImageDataNoise[];


COMPONENT_EXPORT(UNGOOGLED) extern const char kFingerprint[];
COMPONENT_EXPORT(UNGOOGLED) extern const char kFingerprintPlatform[];
COMPONENT_EXPORT(UNGOOGLED) extern const char kFingerprintPlatformVersion[];
COMPONENT_EXPORT(UNGOOGLED) extern const char kFingerprintBrand[];
COMPONENT_EXPORT(UNGOOGLED) extern const char kFingerprintBrandVersion[];
COMPONENT_EXPORT(UNGOOGLED) extern const char kFingerprintHardwareConcurrency[];

}

#endif  // THIRD_PARTY_UNGOOGLED_FINGERPRINTING_SWITCHES_H_