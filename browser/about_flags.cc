#include <initializer_list>

#include "base/strings/string_util.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "build/build_config.h"
#include "chrome/browser/ui/ui_features.h"
#include "components/content_settings/core/common/features.h"
#include "components/flags_ui/feature_entry.h"
#include "components/flags_ui/feature_entry_macros.h"
#include "components/flags_ui/flags_state.h"
#include "components/omnibox/common/omnibox_features.h"
#include "components/translate/core/browser/translate_prefs.h"
#include "net/base/features.h"
#include "third_party/blink/public/common/features.h"

#if BUILDFLAG(ENABLE_IPFS)
#include "mises/components/ipfs/features.h"
#endif

#if BUILDFLAG(IS_ANDROID)
#include "mises/browser/android/preferences/features.h"
#include "mises/components/search_engines/features.h"
#endif

#define EXPAND_FEATURE_ENTRIES(...) __VA_ARGS__,

#if BUILDFLAG(IS_ANDROID)
#define MISES_SEARCH                                                           \
  EXPAND_FEATURE_ENTRIES({                                                     \
      "mises-search",                                                          \
      "search in mises",                                                       \
      "enable mises search engine.",                                                      \
      kOsAndroid,                                                              \
      FEATURE_VALUE_TYPE(                                                      \
          search_engines::features::kMisesSearch),                                \
  })

#define MISES_BACKGROUND_VIDEO_PLAYBACK_ANDROID                                \
  EXPAND_FEATURE_ENTRIES({                                                     \
      "mises-background-video-playback",                                       \
      "Background video playback",                                             \
      "Enables play audio from video in background when tab is not active or " \
      "device screen is turned off. Try to switch to desktop mode if this "    \
      "feature is not working.",                                               \
      kOsAndroid,                                                              \
      FEATURE_VALUE_TYPE(                                                      \
          preferences::features::kMisesBackgroundVideoPlayback),               \
  })

#else
#define MISES_BACKGROUND_VIDEO_PLAYBACK_ANDROID

#endif  // BUILDFLAG(IS_ANDROID)

#define MISES_IPFS_FEATURE_ENTRIES                                   \
               EXPAND_FEATURE_ENTRIES({                              \
                   "mises-ipfs",                                     \
                   "Enable IPFS",                                    \
                   "Enable native support of IPFS.",                 \
                   kOsDesktop | kOsAndroid,                          \
                   FEATURE_VALUE_TYPE(ipfs::features::kIpfsFeature), \
               })


// Keep the last item empty.
#define LAST_MISES_FEATURE_ENTRIES_ITEM

#define MISES_ABOUT_FLAGS_FEATURE_ENTRIES                                      \
  EXPAND_FEATURE_ENTRIES(                                                      \
      {                                                                        \
          "mises-ephemeral-storage",                                           \
          "Enable Ephemeral Storage",                                          \
          "Use ephemeral storage for third-party frames",                      \
          kOsAll,                                                              \
          FEATURE_VALUE_TYPE(net::features::kMisesEphemeralStorage),           \
      },                                                                       \
      {                                                                        \
          "mises-ephemeral-storage-keep-alive",                                \
          "Ephemeral Storage Keep Alive",                                      \
          "Keep ephemeral storage partitions alive for a specified time "      \
          "after all tabs for that origin are closed",                         \
          kOsAll,                                                              \
          FEATURE_VALUE_TYPE(net::features::kMisesEphemeralStorageKeepAlive),  \
      },                                                                       \
      {                                                                        \
          "mises-first-party-ephemeral-storage",                               \
          "Enable First Party Ephemeral Storage",                              \
          "Enable support for First Party Ephemeral Storage using "            \
          "SESSION_ONLY cookie setting",                                       \
          kOsAll,                                                              \
          FEATURE_VALUE_TYPE(net::features::kMisesFirstPartyEphemeralStorage), \
      },                                                                       \
      {                                                                        \
          "mises-forget-first-party-storage",                                  \
          "Enable First Party Storage Cleanup support",                        \
          "Add cookie blocking mode which allows Brave to cleanup first "      \
          "party storage (Cookies, DOM Storage) on website close",             \
          kOsAll,                                                              \
          FEATURE_VALUE_TYPE(net::features::kMisesForgetFirstPartyStorage),    \
      },                                                                       \
      {                                                                        \
          "https-by-default",                                                  \
          "Use HTTPS by Default",                                              \
          "Attempt to connect to all websites using HTTPS before falling "     \
          "back to HTTP.",                                                     \
          kOsAll,                                                              \
          FEATURE_VALUE_TYPE(net::features::kMisesHttpsByDefault),             \
      })                                                                       \
  MISES_IPFS_FEATURE_ENTRIES                                                   \
  MISES_BACKGROUND_VIDEO_PLAYBACK_ANDROID                                      \
  MISES_SEARCH                                                                 \
  LAST_MISES_FEATURE_ENTRIES_ITEM  // Keep it as the last item.

namespace flags_ui {
namespace {
  // Unused function to reference Brave feature entries for clang checks.
[[maybe_unused]] void UseBraveAboutFlags() {
  // These vars are declared in anonymous namespace in
  // //chrome/browser/about_flags.cc. We declare them here manually to
  // instantiate BRAVE_ABOUT_FLAGS_FEATURE_ENTRIES without errors.
  constexpr int kOsAll = 0;
  constexpr int kOsDesktop = 0;

  static_assert(
      std::initializer_list<FeatureEntry>{MISES_ABOUT_FLAGS_FEATURE_ENTRIES}
          .size());
}

}  // namespace
}  // namespace flags_ui