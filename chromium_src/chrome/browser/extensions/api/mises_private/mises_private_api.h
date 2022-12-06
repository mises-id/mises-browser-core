#ifndef CHROME_BROWSER_EXTENSIONS_API_MISES_PRIVATE_MISES_PRIVATE_API_H_
#define CHROME_BROWSER_EXTENSIONS_API_MISES_PRIVATE_MISES_PRIVATE_API_H_
 
#include <stdint.h>

#include <memory>
#include <string>
#include <vector>

#include "base/callback_forward.h"
#include "base/memory/weak_ptr.h"
#include "chrome/common/extensions/api/mises_private.h"
#include "extensions/browser/extension_event_histogram_value.h"
#include "extensions/browser/extension_function.h"

namespace extensions {
	
class MisesPrivateSetMisesIdFunction : public ExtensionFunction
{
public:
  DECLARE_EXTENSION_FUNCTION("misesPrivate.setMisesId",
                             MISESPRIVATE_SETMISESID)

protected:
  ~MisesPrivateSetMisesIdFunction() override;

  ExtensionFunction::ResponseAction Run() override;
};

class MisesPrivateGetInstallReferrerFunction : public ExtensionFunction
{
public:
  ExtensionFunction::ResponseAction Run() override;
  DECLARE_EXTENSION_FUNCTION("misesPrivate.getInstallReferrer",
                             MISESPRIVATE_GETINSTALLREFERRER)

protected:
  ~MisesPrivateGetInstallReferrerFunction() override;

};

class MisesPrivateGetAppStateFunction : public ExtensionFunction
{
public:
  ExtensionFunction::ResponseAction Run() override;
  DECLARE_EXTENSION_FUNCTION("misesPrivate.getAppState",
                             MISESPRIVATE_GETAPPSTATE)

protected:
  ~MisesPrivateGetAppStateFunction() override;

};
 
}  // namespace extensions
 
#endif  // CHROME_BROWSER_EXTENSIONS_API_MISES_PRIVATE_MISES_PRIVATE_API_H_
