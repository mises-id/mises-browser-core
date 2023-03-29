#include <memory>

#include "base/command_line.h"
#include "base/files/file_util.h"
#include "base/strings/string_split.h"
#include "base/task/thread_pool.h"
#include "base/threading/scoped_blocking_call.h"
#include "build/build_config.h"
#include "build/chromeos_buildflags.h"
#include "chrome/browser/browser_process.h"
#include "chrome/browser/enterprise/connectors/connectors_service.h"
#include "chrome/browser/enterprise/signals/signals_utils.h"
#include "chrome/browser/enterprise/util/affiliation.h"
#include "chrome/browser/policy/chrome_browser_policy_connector.h"
#include "chrome/browser/policy/profile_policy_connector.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/common/pref_names.h"
#include "components/component_updater/pref_names.h"
#include "components/policy/content/policy_blocklist_service.h"
#include "components/version_info/version_info.h"
#include "content/public/browser/site_isolation_policy.h"
#include "device_management_backend.pb.h"




#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_POSIX
#define BUILDFLAG_INTERNAL_IS_POSIX() (0)


#include "src/chrome/browser/enterprise/signals/context_info_fetcher.cc"
#undef BUILDFLAG_INTERNAL_IS_POSIX
#define BUILDFLAG_INTERNAL_IS_POSIX() (1)

#else

#include "src/chrome/browser/enterprise/signals/context_info_fetcher.cc"


#endif
