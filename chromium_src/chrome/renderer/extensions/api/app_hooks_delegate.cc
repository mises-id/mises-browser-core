
#include "extensions/common/features/feature_developer_mode_only.h"
#include "extensions/renderer/dispatcher.h"
#include "gin/converter.h"
#include "v8/include/v8-function-callback.h"
#include "v8/include/v8-function.h"
#include "v8/include/v8-isolate.h"
#include "v8/include/v8-object.h"
#include "v8/include/v8-primitive.h"
#include "v8/include/v8-template.h"

namespace extensions {

namespace {
  void GetDefaultEVMWalletID(v8::Local<v8::Name> property_name,
                    const v8::PropertyCallbackInfo<v8::Value>& info) {
    v8::Isolate* isolate = info.GetIsolate();
    std::string id = extensions::GetDefaultEVMWalletID(extensions::kRendererProfileId);

    info.GetReturnValue().Set(
          gin::StringToSymbol(isolate, id));

  }
  void GetDefaultEVMWalletKeyProperty(v8::Local<v8::Name> property_name,
                    const v8::PropertyCallbackInfo<v8::Value>& info) {
    v8::Isolate* isolate = info.GetIsolate();
    std::string key_property = extensions::GetDefaultEVMWalletKeyProperty(extensions::kRendererProfileId);


    info.GetReturnValue().Set(
          gin::StringToSymbol(isolate, key_property));

  }
}
}

#include "src/chrome/renderer/extensions/api/app_hooks_delegate.cc"


