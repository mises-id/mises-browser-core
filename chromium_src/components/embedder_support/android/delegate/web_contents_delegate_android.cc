
#include "components/embedder_support/android/delegate/web_contents_delegate_android.h"

#include "mises/browser/extension_web_contents_helper.h"
#include "chrome/browser/ui/android/tab_model/tab_model.h"
#include "chrome/browser/ui/android/tab_model/tab_model_list.h"
#include "content/public/browser/web_contents.h"
#include "chrome/browser/android/tab_android.h"


#define WebContentsDelegateAndroid WebContentsDelegateAndroid_Chromium
#include "src/components/embedder_support/android/delegate/web_contents_delegate_android.cc"
#undef WebContentsDelegateAndroid



namespace web_contents_delegate_android {

WebContentsDelegateAndroid::WebContentsDelegateAndroid(JNIEnv* env,
                             const jni_zero::JavaRef<jobject>& obj) : WebContentsDelegateAndroid_Chromium(env, obj) {

}

WebContents* WebContentsDelegateAndroid::OpenURLFromTab(
    WebContents* source,
    const content::OpenURLParams& params,
    base::OnceCallback<void(content::NavigationHandle&)>
        navigation_handle_callback) {
  const GURL& url = params.url;
  WindowOpenDisposition disposition = params.disposition;
  LOG(INFO) << "OpenURLFromTab:" << url << ", " << (int)disposition;
  return WebContentsDelegateAndroid_Chromium::OpenURLFromTab(source, params, std::move(navigation_handle_callback));
}


void WebContentsDelegateAndroid::CloseContents(WebContents* source) {
  WebContentsDelegateAndroid_Chromium::CloseContents(source);
  LOG(INFO) << "CloseContents";
  auto* helper = ExtensionWebContentsHelper::FromWebContents(source);
  if (helper) {
    TabModel *tab_strip = nullptr;
    if (!TabModelList::models().empty()) {
      tab_strip = *(TabModelList::models().begin());
    }
    if (tab_strip) {
      tab_strip->CloseTabForExtension(helper->ExtensionId());
    }
  }
}

bool WebContentsDelegateAndroid::IsWebContentsCreationOverridden(
    content::SiteInstance* source_site_instance,
    content::mojom::WindowContainerType window_container_type,
    const GURL& opener_url,
    const std::string& frame_name,
    const GURL& target_url) {
  
  bool ret =  WebContentsDelegateAndroid_Chromium::IsWebContentsCreationOverridden(
    source_site_instance, window_container_type, opener_url, frame_name, target_url);
  LOG(INFO) << "IsWebContentsCreationOverridden:" << ret;
  return ret;
}


WebContents* WebContentsDelegateAndroid::AddNewContents(
  WebContents* source,
  std::unique_ptr<WebContents> new_contents,
  const GURL& target_url,
  WindowOpenDisposition disposition,
  const blink::mojom::WindowFeatures& window_features,
  bool user_gesture,
  bool* was_blocked) {
  LOG(INFO) << "AddNewContents:" << target_url << ", " << (int)disposition;
  // content::OpenURLParams params(url, content::Referrer(), disposition,
  //                               ui::PAGE_TRANSITION_AUTO_TOPLEVEL, false);

  return nullptr;

}

}