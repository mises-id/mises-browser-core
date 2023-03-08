#ifndef MISES_BROWSER_DOWNLOAD_DOWNLOAD_UI_MODEL_H_
#define MISES_BROWSER_DOWNLOAD_DOWNLOAD_UI_MODEL_H_

#include <stdint.h>

#include <string>

#include "base/files/file_path.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/weak_ptr.h"
#include "base/task/sequenced_task_runner.h"
#include "base/time/default_clock.h"
#include "build/build_config.h"
#include "chrome/browser/profiles/profile_manager.h"
#include "components/download/public/common/download_item.h"
#include "components/offline_items_collection/core/offline_item.h"
#include "components/safe_browsing/buildflags.h"
#include "components/safe_browsing/content/common/proto/download_file_types.pb.h"
#include "ui/base/models/image_model.h"
#include "ui/color/color_id.h"
#include "ui/gfx/vector_icon_types.h"
#include "chrome/browser/download/download_commands.h"

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/download/download_ui_model.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/download/download_ui_model.h"


#endif



#endif  // CHROME_BROWSER_DOWNLOAD_DOWNLOAD_UI_MODEL_H_
