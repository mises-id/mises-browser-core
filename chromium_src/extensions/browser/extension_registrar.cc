#include "extensions/browser/extension_registrar.h"
#define TerminateExtension TerminateExtension_Chromium
#include "src/extensions/browser/extension_registrar.cc"
#undef TerminateExtension

namespace extensions{
void ExtensionRegistrar::TerminateExtension(const ExtensionId& extension_id) {
  DCHECK_CURRENTLY_ON(content::BrowserThread::UI);

  const ExtensionId saved_extension_id = extension_id;
  LOG(INFO) << "[EXTENSIONS] Calling ExtensionRegistrar::TerminateExtension on id: " << extension_id;
  TerminateExtension_Chromium(extension_id);
#if BUILDFLAG(IS_ANDROID)
  ReloadExtension(saved_extension_id, LoadErrorBehavior::kQuiet);
#endif
}

}  // namespace extensions
