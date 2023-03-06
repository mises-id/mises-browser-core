#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/passwords/passwords_model_delegate.h"
base::WeakPtr<PasswordsModelDelegate>
PasswordsModelDelegateFromWebContents(content::WebContents* web_contents) {
  return nullptr;
}

#else

#include "src/chrome/browser/ui/passwords/passwords_model_delegate.cc"

#endif
