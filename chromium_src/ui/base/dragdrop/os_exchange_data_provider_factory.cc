#include "ui/base/dragdrop/os_exchange_data_provider_factory.h"

#include "base/notreached.h"
#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_FUCHSIA
#define BUILDFLAG_INTERNAL_IS_FUCHSIA() (1)


#include "src/ui/base/dragdrop/os_exchange_data_provider_factory.cc"
#undef BUILDFLAG_INTERNAL_IS_FUCHSIA
#define BUILDFLAG_INTERNAL_IS_FUCHSIA() (0)

#else

#include "src/ui/base/dragdrop/os_exchange_data_provider_factory.cc"


#endif

