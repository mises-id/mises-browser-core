#include "chrome/browser/startup_data.h"

//Notice ExtensionPrefs must be created before CreateExtensionPrefStore, or there will be a 
//Reentrancy issue in ExtensionPrefs constructor caused  by PrefValueStore::NotifyPrefChanged

#define TakeProfilePrefService  \
  TakeProfilePrefService(); \
  extensions::ExtensionPrefs::Get(this); \
  prefs_->UpdateExtensionPrefStore(CreateExtensionPrefStore(this, false)); \
  IsOffTheRecord

#include "src/chrome/browser/profiles/profile_impl.cc"

#undef TakeProfilePrefService