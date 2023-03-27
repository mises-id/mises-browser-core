#ifndef MISES_UI_VIEWS_CONTROLS_MENU_MENU_HOST_H_
#define MISES_UI_VIEWS_CONTROLS_MENU_MENU_HOST_H_

#include <memory>

#include "base/memory/raw_ptr.h"
#include "build/build_config.h"
#include "ui/base/ui_base_types.h"
#include "ui/gfx/geometry/rect.h"
#include "ui/views/widget/widget.h"
#include "ui/views/widget/widget_observer.h"


#if BUILDFLAG(IS_ANDROID)
#undef BUILDFLAG_INTERNAL_IS_MAC
#define BUILDFLAG_INTERNAL_IS_MAC() (1)



#include "src/ui/views/controls/menu/menu_host.h"
#undef BUILDFLAG_INTERNAL_IS_MAC
#define BUILDFLAG_INTERNAL_IS_MAC() (0)


#else

#include "src/ui/views/controls/menu/menu_host.h"


#endif

#endif