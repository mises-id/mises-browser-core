#include "src/chrome/browser/ui/media_router/media_router_ui.cc"

#if BUILDFLAG(IS_ANDROID)

// static
std::string media_router::WiredDisplayMediaRouteProvider::GetSinkIdForDisplay(
    const display::Display& display) {
  return "wired_display_" + std::to_string(display.id());
}

#endif

