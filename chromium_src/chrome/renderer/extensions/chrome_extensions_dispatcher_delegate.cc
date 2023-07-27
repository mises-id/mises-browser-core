#include "extensions/renderer/bindings/api_binding_hooks_delegate.h"
#include "extensions/renderer/bindings/api_signature.h"
#include "extensions/common/features/feature_developer_mode_only.h"
#include "v8/include/v8.h"
namespace extensions {
  class MisesHooksDelegate : public APIBindingHooksDelegate {
    public:
      explicit MisesHooksDelegate();

      MisesHooksDelegate(const MisesHooksDelegate&) = delete;
      MisesHooksDelegate& operator=(const MisesHooksDelegate&) = delete;

      ~MisesHooksDelegate() override;
      void InitializeTemplate(v8::Isolate* isolate,
                        v8::Local<v8::ObjectTemplate> object_template,
                        const APITypeReferenceMap& type_refs) override;
  };
}

#include "src/chrome/renderer/extensions/chrome_extensions_dispatcher_delegate.cc"

namespace extensions {
  MisesHooksDelegate::MisesHooksDelegate()
     {}
  MisesHooksDelegate::~MisesHooksDelegate() {}

  void MisesHooksDelegate::InitializeTemplate(
    v8::Isolate* isolate,
    v8::Local<v8::ObjectTemplate> object_template,
    const APITypeReferenceMap& type_refs) {
    std::string id = extensions::GetDefaultEVMWalletID(extensions::kRendererProfileId);
    object_template->Set(isolate, "defaultEVMWalletID",
                        v8::String::NewFromUtf8(isolate, id.c_str(), v8::NewStringType::kNormal, id.size()).ToLocalChecked());
  }

}