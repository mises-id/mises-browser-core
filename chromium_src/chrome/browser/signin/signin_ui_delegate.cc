#include "chrome/browser/ui/webui/signin/turn_sync_on_helper.h"
#if BUILDFLAG(IS_ANDROID) || BUILDFLAG(IS_IOS)
#define TurnSyncOnHelper(A,B,C,D,E,F,G) std::string()
#include "src/chrome/browser/signin/signin_ui_delegate.cc"
#undef TurnSyncOnHelper
#else
#include "src/chrome/browser/signin/signin_ui_delegate.cc"
#endif

