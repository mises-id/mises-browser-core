
#include "src/chrome/browser/media/webrtc/desktop_media_picker_factory_impl.cc"
#if BUILDFLAG(IS_ANDROID)
std::unique_ptr<DesktopMediaPicker> DesktopMediaPicker::Create(
    const content::MediaStreamRequest* request) {
  return nullptr;
}

#endif