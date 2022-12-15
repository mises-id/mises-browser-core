// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
#include "build/build_config.h"
#include "src/content/browser/renderer_host/render_frame_host_impl.cc"
#if BUILDFLAG(IS_ANDROID)
class MisesAllowInjectingJavascript {
public:
    MisesAllowInjectingJavascript() {
        content::RenderFrameHost::AllowInjectingJavaScript();
    }
};
static MisesAllowInjectingJavascript  s_misse_allow_injecting_javascript;
#endif
