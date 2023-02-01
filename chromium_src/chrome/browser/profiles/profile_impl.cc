#include "chrome/browser/startup_data.h"

#define TakeProfilePrefService                                           \
  TakeProfilePrefService(); \
  prefs_->UpdateExtensionPrefStore(CreateExtensionPrefStore(this, false)); \
  IsOffTheRecord

#include "src/chrome/browser/profiles/profile_impl.cc"

#undef TakeProfilePrefService