#include "build/build_config.h"
#include "components/crx_file/crx_verifier.h"

#if BUILDFLAG(IS_ANDROID)
#include "base/android/content_uri_utils.h"
#define MISES_CRX_CONTENT_URL_HANDLER \
  base::File file; \
  if (crx_path.IsContentUri()) { \
    file = base::OpenContentUriForRead(crx_path); \
  } else { \
    file = base::File(crx_path, base::File::FLAG_OPEN | base::File::FLAG_READ); \
  }

#else

#define MISES_CRX_CONTENT_URL_HANDLER base::File file(crx_path, base::File::FLAG_OPEN | base::File::FLAG_READ);

#endif 


#include "src/components/crx_file/crx_verifier.cc"
#undef MISES_CRX_CONTENT_URL_HANDLER

