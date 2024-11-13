#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/media/webrtc/desktop_media_picker_controller.h"


DesktopMediaPickerController::DesktopMediaPickerController(
    DesktopMediaPickerFactory* picker_factory)
    : picker_factory_(picker_factory) {}

DesktopMediaPickerController::~DesktopMediaPickerController() = default;


void DesktopMediaPickerController::Show(
    const Params& params,
    const std::vector<DesktopMediaList::Type>& sources,
    DesktopMediaList::WebContentsFilter includable_web_contents_filter,
    DoneCallback done_callback) {
}
void DesktopMediaPickerController::WebContentsDestroyed() {
}
#else

#include "src/chrome/browser/media/webrtc/desktop_media_picker_controller.cc"

#endif

