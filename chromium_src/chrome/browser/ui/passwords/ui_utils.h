#ifndef MISES_BROWSER_UI_PASSWORDS_UI_UTILS_H_
#define MISES_BROWSER_UI_PASSWORDS_UI_UTILS_H_

#include "build/build_config.h"

#include "build/build_config.h"
#include "components/password_manager/core/browser/manage_passwords_referrer.h"
#include "components/password_manager/core/browser/origin_credential_store.h"
#include "mojo/public/cpp/bindings/remote.h"
#include "services/network/public/mojom/url_loader_factory.mojom.h"
#include "ui/gfx/vector_icon_types.h"

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/passwords/ui_utils.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/ui/passwords/ui_utils.h"


#endif



#endif  // CHROME_BROWSER_UI_SIGNIN_VIEW_CONTROLLER_H_

