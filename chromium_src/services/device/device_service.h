// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef MISES_SERVICES_DEVICE_DEVICE_SERVICE_H_
#define MISES_SERVICES_DEVICE_DEVICE_SERVICE_H_

#include "build/build_config.h"
#include "services/device/public/mojom/device_service.mojom.h"
#if BUILDFLAG(IS_ANDROID)
#define BindVibrationManager BindHidManager( \
      mojo::PendingReceiver<mojom::HidManager> receiver) override; \
      void BindVibrationManager
#include "src/services/device/device_service.h"
#undef BindVibrationManager
#else 

#include "src/services/device/device_service.h"
#endif


#endif  // SERVICES_DEVICE_DEVICE_SERVICE_H_
