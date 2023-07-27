#ifndef CHROME_BROWSER_EXTENSIONS_API_MISES_PRIVATE_MISES_PRIVATE_API_H_
#define CHROME_BROWSER_EXTENSIONS_API_MISES_PRIVATE_MISES_PRIVATE_API_H_

#include <stdint.h>

#include <memory>
#include <string>
#include <vector>

#include "base/barrier_callback.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/weak_ptr.h"
#include "mises/components/api_request_helper/api_request_helper.h"

#include "base/functional/callback_forward.h"
#include "base/memory/weak_ptr.h"
#include "extensions/browser/extension_event_histogram_value.h"
#include "extensions/browser/extension_function.h"
#include "mises/common/extensions/api/mises_private.h"
#include "components/value_store/value_store.h"

namespace extensions {
namespace api {
class MisesPrivateSetMisesIdFunction : public ExtensionFunction
{
public:
  DECLARE_EXTENSION_FUNCTION("misesPrivate.setMisesId",
                             UNKNOWN)

protected:
  ~MisesPrivateSetMisesIdFunction() override = default;

  ExtensionFunction::ResponseAction Run() override;
};

class MisesPrivateGetInstallReferrerFunction : public ExtensionFunction
{
public:
  ExtensionFunction::ResponseAction Run() override;
  DECLARE_EXTENSION_FUNCTION("misesPrivate.getInstallReferrer",
                             UNKNOWN)

protected:
  ~MisesPrivateGetInstallReferrerFunction() override = default;

};


class MisesPrivateGetAppStateFunction : public ExtensionFunction
{
public:
  ExtensionFunction::ResponseAction Run() override;
  DECLARE_EXTENSION_FUNCTION("misesPrivate.getAppState",
                             UNKNOWN)

protected:
  ~MisesPrivateGetAppStateFunction() override = default;

};


class MisesPrivateNotifyPhishingDetectedFunction : public ExtensionFunction
{
public:
  ExtensionFunction::ResponseAction Run() override;
  DECLARE_EXTENSION_FUNCTION("misesPrivate.notifyPhishingDetected",
                             UNKNOWN)

protected:
  ~MisesPrivateNotifyPhishingDetectedFunction() override = default;
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
  ~MisesPrivateRecordEventFunction() override = default;

};


class MisesPrivateFetchJsonFunction : public ExtensionFunction
{
public:
  ExtensionFunction::ResponseAction Run() override;
  DECLARE_EXTENSION_FUNCTION("misesPrivate.fetchJson",
                             UNKNOWN)
  MisesPrivateFetchJsonFunction();
   MisesPrivateFetchJsonFunction(
      const MisesPrivateFetchJsonFunction&) =
      delete;
  MisesPrivateFetchJsonFunction& operator=(
      const MisesPrivateFetchJsonFunction&) =
      delete;
protected:
  ~MisesPrivateFetchJsonFunction() override;

  void OnFetchJson(api_request_helper::APIRequestResult api_request_result);

  std::unique_ptr<api_request_helper::APIRequestHelper> api_request_helper_;
  base::WeakPtrFactory<MisesPrivateFetchJsonFunction> weak_ptr_factory_{this};

};


class MisesPrivateSetDefaultEVMWalletFunction : public ExtensionFunction
{
public:
  ExtensionFunction::ResponseAction Run() override;
  DECLARE_EXTENSION_FUNCTION("misesPrivate.setDefaultEVMWallet",
                             UNKNOWN)

protected:
  ~MisesPrivateSetDefaultEVMWalletFunction() override = default;

};


class MisesPrivateGetDefaultEVMWalletFunction : public ExtensionFunction
{
public:
  ExtensionFunction::ResponseAction Run() override;
  DECLARE_EXTENSION_FUNCTION("misesPrivate.getDefaultEVMWallet",
                             UNKNOWN)
protected:
  ~MisesPrivateGetDefaultEVMWalletFunction() override = default;

};



}  // namespace api
}  // namespace extensions

#endif  // CHROME_BROWSER_EXTENSIONS_API_MISES_PRIVATE_MISES_PRIVATE_API_H_
