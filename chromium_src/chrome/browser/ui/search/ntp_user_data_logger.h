#ifndef MISES_BROWSER_UI_SEARCH_NTP_USER_DATA_LOGGER_H_
#define MISES_BROWSER_UI_SEARCH_NTP_USER_DATA_LOGGER_H_

#include <stddef.h>

#include <array>

#include "base/memory/raw_ptr.h"
#include "base/time/time.h"
#include "build/build_config.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/common/search/ntp_logging_events.h"
#include "components/ntp_tiles/constants.h"
#include "components/ntp_tiles/ntp_tile_impression.h"
#include "third_party/abseil-cpp/absl/types/optional.h"


#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/ui/search/ntp_user_data_logger.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/ui/search/ntp_user_data_logger.h"


#endif


#endif  // CHROME_BROWSER_UI_SEARCH_NTP_USER_DATA_LOGGER_H_
