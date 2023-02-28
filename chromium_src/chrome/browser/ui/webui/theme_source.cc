#include "base/notreached.h"
#include "base/logging.h"
#undef NOTREACHED
#define NOTREACHED() LOG(INFO)
#include "src/chrome/browser/ui/webui/theme_source.cc"
#undef NOTREACHED