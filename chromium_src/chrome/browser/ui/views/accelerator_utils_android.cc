#include <stddef.h>

#include "build/chromeos_buildflags.h"
#include "chrome/browser/ui/views/accelerator_table.h"
#include "ui/base/accelerators/accelerator.h"
#include "chrome/browser/ui/views/frame/browser_view.h"

namespace chrome {

bool IsChromeAccelerator(const ui::Accelerator& accelerator) {
  return false;
}

ui::Accelerator GetPrimaryChromeAcceleratorForBookmarkPage() {
  return ui::Accelerator();
}

ui::Accelerator GetPrimaryChromeAcceleratorForBookmarkTab() {
  return ui::Accelerator();
}

ui::AcceleratorProvider* AcceleratorProviderForBrowser(Browser* browser) {
	  return BrowserView::GetBrowserViewForBrowser(browser);
}

}  // namespace chrome
