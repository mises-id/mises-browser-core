#ifndef MISES_COMPONENTS_PASSWORD_MANAGER_CORE_BROWSER_UI_INSECURE_CREDENTIALS_MANAGER_H_
#define MISES_COMPONENTS_PASSWORD_MANAGER_CORE_BROWSER_UI_INSECURE_CREDENTIALS_MANAGER_H_

#include <map>
#include <vector>

#include "base/functional/callback_forward.h"
#include "base/functional/callback_helpers.h"
#include "base/containers/flat_set.h"
#include "base/containers/span.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/scoped_refptr.h"
#include "base/observer_list.h"
#include "base/observer_list_types.h"
#include "base/scoped_observation.h"
#include "base/time/time.h"
#include "base/timer/elapsed_timer.h"
#include "base/types/strong_alias.h"
#include "build/build_config.h"
#include "components/password_manager/core/browser/leak_detection/bulk_leak_check.h"
#include "components/password_manager/core/browser/password_store/password_store_interface.h"
#include "components/password_manager/core/browser/ui/credential_utils.h"
#include "components/password_manager/core/browser/ui/saved_passwords_presenter.h"
#include "url/gurl.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/components/password_manager/core/browser/ui/insecure_credentials_manager.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/components/password_manager/core/browser/ui/insecure_credentials_manager.h"


#endif


#endif  // COMPONENTS_PASSWORD_MANAGER_CORE_BROWSER_UI_INSECURE_CREDENTIALS_MANAGER_H_
