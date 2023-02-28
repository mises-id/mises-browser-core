#include "chrome/browser/obsolete_system/obsolete_system.h"

// static
bool ObsoleteSystem::IsObsoleteNowOrSoon() {
  return false;
}

// static
std::u16string ObsoleteSystem::LocalizedObsoleteString() {
  return std::u16string();
}

// static
bool ObsoleteSystem::IsEndOfTheLine() {
  return false;
}

// static
const char* ObsoleteSystem::GetLinkURL() {
  return "";
}

