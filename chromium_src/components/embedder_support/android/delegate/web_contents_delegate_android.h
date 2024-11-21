#ifndef MISES_COMPONENTS_EMBEDDER_SUPPORT_ANDROID_DELEGATE_WEB_CONTENTS_DELEGATE_ANDROID_H_
#define MISES_COMPONENTS_EMBEDDER_SUPPORT_ANDROID_DELEGATE_WEB_CONTENTS_DELEGATE_ANDROID_H_

#define WebContentsDelegateAndroid WebContentsDelegateAndroid_Chromium

#include "src/components/embedder_support/android/delegate/web_contents_delegate_android.h"
#undef WebContentsDelegateAndroid

namespace web_contents_delegate_android {

class WebContentsDelegateAndroid : public WebContentsDelegateAndroid_Chromium {
  public:
    WebContentsDelegateAndroid(JNIEnv* env,
                             const jni_zero::JavaRef<jobject>& obj);
    content::WebContents* OpenURLFromTab(
      content::WebContents* source,
      const content::OpenURLParams& params,
      base::OnceCallback<void(content::NavigationHandle&)>
          navigation_handle_callback) override;
    void CloseContents(content::WebContents* source) override;

    bool IsWebContentsCreationOverridden(
      content::SiteInstance* source_site_instance,
      content::mojom::WindowContainerType window_container_type,
      const GURL& opener_url,
      const std::string& frame_name,
      const GURL& target_url) override;

    content::WebContents* AddNewContents(
      content::WebContents* source,
      std::unique_ptr<content::WebContents> new_contents,
      const GURL& target_url,
      WindowOpenDisposition disposition,
      const blink::mojom::WindowFeatures& window_features,
      bool user_gesture,
      bool* was_blocked) override;
};

}

#endif