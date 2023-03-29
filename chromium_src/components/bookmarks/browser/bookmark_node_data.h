#ifndef MISES_COMPONENTS_BOOKMARKS_BROWSER_BOOKMARK_NODE_DATA_H_
#define MISES_COMPONENTS_BOOKMARKS_BROWSER_BOOKMARK_NODE_DATA_H_

#include <stddef.h>
#include <stdint.h>

#include <string>
#include <vector>

#include "base/files/file_path.h"
#include "base/time/time.h"
#include "build/build_config.h"
#include "components/bookmarks/browser/bookmark_node.h"
#include "ui/base/clipboard/clipboard_buffer.h"
#include "url/gurl.h"


#if BUILDFLAG(IS_ANDROID)

#undef TOOLKIT_VIEWS
#define TOOLKIT_VIEWS 1

#include "src/components/bookmarks/browser/bookmark_node_data.h"
#undef TOOLKIT_VIEWS 
#define TOOLKIT_VIEWS 0

#else

#include "src/components/bookmarks/browser/bookmark_node_data.h"


#endif


#endif  // COMPONENTS_BOOKMARKS_BROWSER_BOOKMARK_NODE_DATA_H_
