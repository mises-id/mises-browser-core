#include "src/chrome/browser/picture_in_picture/picture_in_picture_window_manager.cc"

#if BUILDFLAG(IS_ANDROID)


PictureInPictureOcclusionTracker*
PictureInPictureWindowManager::GetOcclusionTracker() {
  return nullptr;
}

#endif