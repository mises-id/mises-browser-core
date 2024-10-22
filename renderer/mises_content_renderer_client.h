/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef MISES_RENDERER_BRAVE_CONTENT_RENDERER_CLIENT_H_
#define MISES_RENDERER_BRAVE_CONTENT_RENDERER_CLIENT_H_

#include <memory>

#include "chrome/renderer/chrome_content_renderer_client.h"
#include "v8/include/v8.h"

class MisesRenderThreadObserver;
class GURL;

namespace blink {
class WebServiceWorkerContextProxy;
}

class MisesContentRendererClient : public ChromeContentRendererClient {
 public:
  MisesContentRendererClient();
  MisesContentRendererClient(const MisesContentRendererClient&) = delete;
  MisesContentRendererClient& operator=(const MisesContentRendererClient&) =
      delete;
  ~MisesContentRendererClient() override;

  void RenderThreadStarted() override;
  void SetRuntimeFeaturesDefaultsBeforeBlinkInitialization() override;
  void RenderFrameCreated(content::RenderFrame* render_frame) override;
  std::unique_ptr<media::KeySystemSupportRegistration> GetSupportedKeySystems(
      content::RenderFrame* render_frame,
      media::GetSupportedKeySystemsCB cb) override;
  void RunScriptsAtDocumentStart(content::RenderFrame* render_frame) override;
  void WillEvaluateServiceWorkerOnWorkerThread(
      blink::WebServiceWorkerContextProxy* context_proxy,
      v8::Local<v8::Context> v8_context,
      int64_t service_worker_version_id,
      const GURL& service_worker_scope,
      const GURL& script_url,
      const blink::ServiceWorkerToken& service_worker_token) override;
  void WillDestroyServiceWorkerContextOnWorkerThread(
      v8::Local<v8::Context> v8_context,
      int64_t service_worker_version_id,
      const GURL& service_worker_scope,
      const GURL& script_url) override;

 private:
  std::unique_ptr<MisesRenderThreadObserver> mises_render_thread_observer_;
};

#endif  // BRAVE_RENDERER_BRAVE_CONTENT_RENDERER_CLIENT_H_
