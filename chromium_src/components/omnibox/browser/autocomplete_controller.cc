#include "components/omnibox/browser/autocomplete_controller.h"
#include "mises/components/omnibox/browser/mises_provider.h"

#define MISES_AUTOCOMPLETE_CONTROLLER_AUTOCOMPLETE_CONTROLLER  \
  providers_.push_back(new MisesProvider(provider_client_.get(),this));

#include "src/components/omnibox/browser/autocomplete_controller.cc"

#undef MISES_AUTOCOMPLETE_CONTROLLER_AUTOCOMPLETE_CONTROLLER
