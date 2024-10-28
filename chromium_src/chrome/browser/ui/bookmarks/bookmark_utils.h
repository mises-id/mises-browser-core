

#ifndef MISES_BROWSER_UI_BOOKMARKS_BOOKMARK_UTILS_H_
#define MISES_BROWSER_UI_BOOKMARKS_BOOKMARK_UTILS_H_

#include <string>
#include <vector>

#include "third_party/skia/include/core/SkColor.h"
#include "ui/base/dragdrop/mojom/drag_drop_types.mojom-forward.h"
#include "ui/base/models/image_model.h"
#include "ui/base/window_open_disposition.h"
#include "ui/gfx/native_widget_types.h"


#if BUILDFLAG(IS_ANDROID)

#define TOOLKIT_VIEWS 1

#include "src/chrome/browser/ui/bookmarks/bookmark_utils.h"
#undef TOOLKIT_VIEWS 

#else

#include "src/chrome/browser/ui/bookmarks/bookmark_utils.h"


#endif

#endif  // CHROME_BROWSER_UI_BOOKMARKS_BOOKMARK_UTILS_H_
