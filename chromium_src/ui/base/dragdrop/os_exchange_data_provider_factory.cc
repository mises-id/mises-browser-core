#include "ui/base/dragdrop/os_exchange_data_provider_factory.h"

#include "base/notreached.h"
#include "build/build_config.h"
#include "ui/base/dragdrop/os_exchange_data_provider_non_backed.h"

#if BUILDFLAG(IS_ANDROID)

namespace ui {

// static
std::unique_ptr<OSExchangeDataProvider>
OSExchangeDataProviderFactory::CreateProvider() {
  return std::make_unique<OSExchangeDataProviderNonBacked>();
}
}

#else

#include "src/ui/base/dragdrop/os_exchange_data_provider_factory.cc"


#endif

