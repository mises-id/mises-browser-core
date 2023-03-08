#ifndef MISES_BROWSER_EXTENSIONS_API_RUNTIME_CHROME_RUNTIME_API_DELEGATE_H_
#define MISES_BROWSER_EXTENSIONS_API_RUNTIME_CHROME_RUNTIME_API_DELEGATE_H_

#include <map>
#include <string>
#include <utility>

#include "base/memory/raw_ptr.h"
#include "base/scoped_observation.h"
#include "content/public/browser/notification_observer.h"
#include "content/public/browser/notification_registrar.h"
#include "extensions/browser/api/runtime/runtime_api.h"
#include "extensions/browser/api/runtime/runtime_api_delegate.h"
#include "extensions/browser/extension_registry.h"
#include "extensions/browser/extension_registry_observer.h"


#define GetPlatformInfo  \
      GetPlatformInfo_Chromium(extensions::api::runtime::PlatformInfo* info);\
      bool GetPlatformInfo

#include "src/chrome/browser/extensions/api/runtime/chrome_runtime_api_delegate.h"

#undef GetPlatformInfo

#endif  // CHROME_BROWSER_EXTENSIONS_API_RUNTIME_CHROME_RUNTIME_API_DELEGATE_H_
