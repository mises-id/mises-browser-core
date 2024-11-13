/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/renderer/brave_wallet/brave_wallet_render_frame_observer_p3a_util.h"

#include "mises/components/brave_wallet/renderer/v8_helper.h"
#include "gin/converter.h"
#include "third_party/blink/public/platform/browser_interface_broker_proxy.h"
#include "third_party/blink/public/web/blink.h"
#include "third_party/blink/public/web/web_local_frame.h"
#include "third_party/blink/public/platform/scheduler/web_agent_group_scheduler.h"
#include "v8/include/v8.h"

namespace brave_wallet {

namespace {

const char kEthereumProviderObjectKey[] = "ethereum";
const char kSolanaProviderObjectKey[] = "solana";
const char kIsMisesWalletPropertyName[] = "isMisesWallet";

}  // namespace

BraveWalletRenderFrameObserverP3AUtil::BraveWalletRenderFrameObserverP3AUtil() {
}
BraveWalletRenderFrameObserverP3AUtil::
    ~BraveWalletRenderFrameObserverP3AUtil() {}

void BraveWalletRenderFrameObserverP3AUtil::ReportJSProviders(
    content::RenderFrame* render_frame) {
  if (!EnsureConnected(render_frame)) {
    return;
  }

  v8::Isolate* isolate =
      render_frame->GetWebFrame()->GetAgentGroupScheduler()->Isolate();
  v8::HandleScope handle_scope(isolate);
  auto* web_frame = render_frame->GetWebFrame();
  v8::Local<v8::Context> context = web_frame->MainWorldScriptContext();
  if (context.IsEmpty()) {
    return;
  }
  v8::MicrotasksScope microtasks(isolate, context->GetMicrotaskQueue(),
                                 v8::MicrotasksScope::kDoNotRunMicrotasks);

  ReportJSProvider(isolate, context, mojom::CoinType::ETH,
                   kEthereumProviderObjectKey,
                   true,
                   true);
  ReportJSProvider(isolate, context, mojom::CoinType::SOL,
                   kSolanaProviderObjectKey,
                   true,
                   true);
}

void BraveWalletRenderFrameObserverP3AUtil::ReportJSProvider(
    v8::Isolate* isolate,
    v8::Local<v8::Context>& context,
    mojom::CoinType coin_type,
    const char* provider_object_key,
    bool use_native_wallet_enabled,
    bool allow_provider_overwrite) {
  v8::Local<v8::Value> provider_value;
  v8::Local<v8::Object> provider_obj;
  mojom::JSProviderType provider_type = mojom::JSProviderType::None;
  if (context->Global()
          ->Get(context, gin::StringToV8(isolate, provider_object_key))
          .ToLocal(&provider_value) &&
      provider_value->IsObject() &&
      provider_value->ToObject(context).ToLocal(&provider_obj)) {
    v8::Local<v8::Value> is_brave_wallet;

    bool strict_native_wallet_enabled =
        use_native_wallet_enabled && !allow_provider_overwrite;
    if ((GetProperty(context, provider_obj, kIsMisesWalletPropertyName)
             .ToLocal(&is_brave_wallet) &&
         is_brave_wallet->BooleanValue(isolate)) ||
        strict_native_wallet_enabled) {
      provider_type = mojom::JSProviderType::Native;
    } else {
      provider_type = mojom::JSProviderType::ThirdParty;
    }
  }
  brave_wallet_p3a_->ReportJSProvider(provider_type, coin_type,
                                      use_native_wallet_enabled,
                                      allow_provider_overwrite);
}

bool BraveWalletRenderFrameObserverP3AUtil::EnsureConnected(
    content::RenderFrame* render_frame) {
  if (!brave_wallet_p3a_.is_bound()) {
    render_frame->GetBrowserInterfaceBroker().GetInterface(
        brave_wallet_p3a_.BindNewPipeAndPassReceiver());
  }
  return brave_wallet_p3a_.is_bound();
}

}  // namespace brave_wallet
