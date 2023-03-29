#include "base/feature_list.h"
#include "build/build_config.h"

#define FEATURE_DISABLED_BY_DEFAULT FEATURE_ENABLED_BY_DEFAULT

#include "src/services/metrics/public/cpp/ukm_recorder.cc"

#undef FEATURE_DISABLED_BY_DEFAULT

