#ifndef MISES_BROWSER_UI_BROWSER_NAVIGATOR_PARAMS_H_
#define MISES_BROWSER_UI_BROWSER_NAVIGATOR_PARAMS_H_

#include "build/build_config.h"

#include <memory>
#include <string>
#include <vector>

#include "base/memory/raw_ptr.h"
#include "base/memory/ref_counted.h"
#include "base/time/time.h"
#include "build/build_config.h"
#include "content/public/browser/global_request_id.h"
#include "content/public/browser/reload_type.h"
#include "content/public/browser/render_frame_host.h"
#include "content/public/browser/site_instance.h"
#include "content/public/browser/child_process_host.h"
#include "content/public/common/referrer.h"
#include "services/network/public/cpp/resource_request_body.h"
#include "services/network/public/cpp/shared_url_loader_factory.h"
#include "third_party/abseil-cpp/absl/types/optional.h"
#include "third_party/blink/public/common/navigation/impression.h"
#include "third_party/blink/public/common/tokens/tokens.h"
#include "third_party/blink/public/mojom/navigation/was_activated_option.mojom.h"
#include "ui/base/page_transition_types.h"
#include "ui/base/window_open_disposition.h"
#include "ui/gfx/geometry/rect.h"
#include "url/gurl.h"

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)

#include "src/chrome/browser/ui/browser_navigator_params.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)


#else

#include "src/chrome/browser/ui/browser_navigator_params.h"


#endif


#endif  // CHROME_BROWSER_UI_BROWSER_NAVIGATOR_PARAMS_H_
