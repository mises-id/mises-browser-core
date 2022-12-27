#include "extensions/common/extension.h"
namespace extensions {
bool Extension::ShouldExposeViaManagementAPI() const {
  //show mises extension in management list
  if (id() == "nkbihfbeogaeaoehlefnkodbefgpgknn") return true;
  if (id() == "jkpbgdgopmifmokhejofbmgdabapoefl") return true;
  return Extension::ShouldExposeViaManagementAPI_ChromiumImpl();
}
}

#define SCHEME_UUID_IN_PACKAGE SCHEME_UUID_IN_PACKAGE | URLPattern::SCHEME_CHROMESEARCH
#define ShouldExposeViaManagementAPI ShouldExposeViaManagementAPI_ChromiumImpl

#include "src/extensions/common/extension.cc"

#undef ShouldExposeViaManagementAPI
#undef SCHEME_UUID_IN_PACKAGE
