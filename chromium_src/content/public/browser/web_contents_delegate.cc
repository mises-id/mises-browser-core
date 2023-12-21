#include "src/content/public/browser/web_contents_delegate.cc"


namespace content {
#if BUILDFLAG(IS_ANDROID)
bool WebContentsDelegate::ShouldUseInstancedSystemMediaControls() const {
  return false;
}

#endif  // !BUILDFLAG(IS_ANDROID)

}