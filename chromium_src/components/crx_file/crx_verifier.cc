// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)
#include "base/android/content_uri_utils.h"
#endif 

#define MISES_CRX_CONTENT_URL_HANDLER \
  base::File file; \
  if (crx_path.IsContentUri()) { \
    file = base::OpenContentUriForRead(crx_path); \
  }else { \
    file = base::File(crx_path, base::File::FLAG_OPEN | base::File::FLAG_READ); \
  }\

#include "src/components/crx_file/crx_verifier.cc"
#undef MISES_CRX_CONTENT_URL_HANDLER

