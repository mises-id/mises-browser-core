#ifndef CHROME_BROWSER_EXTENSIONS_API_MISES_PRIVATE_MISES_PRIVATE_API_H_
#define CHROME_BROWSER_EXTENSIONS_API_MISES_PRIVATE_MISES_PRIVATE_API_H_

#include <stdint.h>

#include <memory>
#include <string>
#include <vector>

#include "base/callback_forward.h"
#include "base/memory/weak_ptr.h"
#include "extensions/browser/extension_event_histogram_value.h"
#include "extensions/browser/extension_function.h"
#include "mises/common/extensions/api/mises_private.h"

namespace extensions {
namespace api {
class MisesPrivateSetMisesIdFunction : public ExtensionFunction
{
public:
  DECLARE_EXTENSION_FUNCTION("misesPrivate.setMisesId",
                             UNKNOWN)

protected:
  ~MisesPrivateSetMisesIdFunction() override;

  ExtensionFunction::ResponseAction Run() override;
};

class MisesPrivateGetInstallReferrerFunction : public ExtensionFunction
{
public:
  ExtensionFunction::ResponseAction Run() override;
  DECLARE_EXTENSION_FUNCTION("misesPrivate.getInstallReferrer",
                             UNKNOWN)

protected:
  ~MisesPrivateGetInstallReferrerFunction() override;

};

class MisesPrivateGetAppStateFunction : public ExtensionFunction
{
public:
  ExtensionFunction::ResponseAction Run() override;
  DECLARE_EXTENSION_FUNCTION("misesPrivate.getAppState",
                             UNKNOWN)

protected:
  ~MisesPrivateGetAppStateFunction() override;

};


class MisesPrivateNotifyPhishingDetectedFunction : public ExtensionFunction
{
public:
  ExtensionFunction::ResponseAction Run() override;
  DECLARE_EXTENSION_FUNCTION("misesPrivate.notifyPhishingDetected",
                             UNKNOWN)

protected:
  ~MisesPrivateNotifyPhishingDetectedFunction() override;
  void OnNotificationHandled(int action);

};
//web3site visit log
class MisesPrivateRecordEventFunction : public ExtensionFunction
{
public:
  ExtensionFunction::ResponseAction Run() override;
  DECLARE_EXTENSION_FUNCTION("misesPrivate.recordEvent",
                             UNKNOWN)

protected:
  ~MisesPrivateRecordEventFunction() override;

};


}  // namespace api
}  // namespace extensions

#endif  // CHROME_BROWSER_EXTENSIONS_API_MISES_PRIVATE_MISES_PRIVATE_API_H_
