#include "chrome/browser/download/bubble/download_bubble_controller.h"

#include "chrome/browser/download/download_ui_model.h"
#include "chrome/browser/download/download_item_model.h"

#if !BUILDFLAG(FULL_SAFE_BROWSING)
#define ReviewScanningVerdict(A)  IsMalicious()
#include "src/chrome/browser/download/bubble/download_bubble_controller.cc"
#undef ReviewScanningVerdict
#else
#include "src/chrome/browser/download/bubble/download_bubble_controller.cc"
#endif


