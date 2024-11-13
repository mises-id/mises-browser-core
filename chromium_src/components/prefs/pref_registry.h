#ifndef MISES_COMPONENTS_PREFS_PREF_REGISTRY_H_
#define MISES_COMPONENTS_PREFS_PREF_REGISTRY_H_

#define RegisterPreference \
  RegisterPreference_Chromium(std::string_view path,\
                          base::Value default_value,\
                          uint32_t flags);\
  void RegisterPreference
#include "src/components/prefs/pref_registry.h"
#undef RegisterPreference


#endif  // COMPONENTS_PREFS_PREF_REGISTRY_H_
