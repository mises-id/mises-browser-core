#include "src/chrome/browser/browser_features.cc"


namespace features {

#if BUILDFLAG(IS_ANDROID)
// Adds an item to the context menu that copies a link to the page with the
// selected text highlighted.
const base::Feature kCopyLinkToText{"CopyLinkToText",
                                    base::FEATURE_ENABLED_BY_DEFAULT};

// Adds a "Snooze" action to mute notifications during screen sharing sessions.
const base::Feature kMuteNotificationSnoozeAction{
    "MuteNotificationSnoozeAction", base::FEATURE_DISABLED_BY_DEFAULT};
#endif

}  // namespace features
