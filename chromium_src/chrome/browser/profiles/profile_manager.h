#ifndef MISES_CHROMIUM_SRC_CHROME_BROWSER_PROFILES_PROFILE_MANAGER_H_
#define MISES_CHROMIUM_SRC_CHROME_BROWSER_PROFILES_PROFILE_MANAGER_H_

#define InitProfileUserPrefs virtual InitProfileUserPrefs
#define DoFinalInitForServices virtual DoFinalInitForServices
#define SetNonPersonalProfilePrefs virtual SetNonPersonalProfilePrefs
#define IsAllowedProfilePath virtual IsAllowedProfilePath
#define LoadProfileByPath virtual LoadProfileByPath
#define TestingProfileManager \
  TestingProfileManager;      \
  friend class MisesProfileManager

#include "src/chrome/browser/profiles/profile_manager.h"


#undef TestingProfileManager
#undef LoadProfileByPath
#undef IsAllowedProfilePath
#undef SetNonPersonalProfilePrefs
#undef DoFinalInitForServices
#undef InitProfileUserPrefs
#undef GetLastUsedProfileName

#endif  // MISES_CHROMIUM_SRC_CHROME_BROWSER_PROFILES_PROFILE_MANAGER_H_
