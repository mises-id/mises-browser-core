#ifndef CHROME_BROWSER_ANDROID_APPMENU_BRIDGE_H_
#define CHROME_BROWSER_ANDROID_APPMENU_BRIDGE_H_


#include <memory>
#include <set>
#include <string>

#include "base/android/jni_android.h"
#include "base/android/jni_weak_ref.h"
#include "base/containers/flat_map.h"
#include "base/guid.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/weak_ptr.h"
#include "base/scoped_observation.h"
#include "base/strings/utf_string_conversions.h"
#include "chrome/browser/profiles/profile_keyed_service_factory.h"
#include "components/keyed_service/core/keyed_service.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/profiles/profile_observer.h"
#include "components/prefs/pref_change_registrar.h"
#include "url/android/gurl_android.h"
#include "ui/gfx/geometry/size.h"
#include "chrome/browser/extensions/api/extension_action/extension_action_api.h"

#include "chrome/browser/ui/android/tab_model/tab_model_list_observer.h"
#include "chrome/browser/ui/android/tab_model/tab_model.h"
#include "chrome/browser/ui/android/tab_model/tab_model_list.h"
#include "chrome/browser/ui/android/tab_model/tab_model_observer.h"
#include "chrome/browser/android/tab_android.h"

namespace base {
template<typename T> struct DefaultSingletonTraits;
}  // namespace base

namespace content {
class BrowserContext;
class WebContents;
}
namespace extensions {
class Extension;
class ExtensionAction;
}

class IconWithBadgeImageSource;
class Profile;

class AppMenuBridge :
        public extensions::ExtensionActionAPI::Observer, 
        public TabModelListObserver,
        public TabModelObserver,
        public ProfileObserver, 
        public KeyedService {
 public:
  class Factory : public ProfileKeyedServiceFactory {
   public:
    // Returns singleton instance of DevToolsAndroidBridge.
    static Factory* GetInstance();

    // Returns AppMenuBridge associated with |profile|.
    static AppMenuBridge* GetForProfile(Profile* profile);

    Factory(const Factory&) = delete;
    Factory& operator=(const Factory&) = delete;

   private:
    friend struct base::DefaultSingletonTraits<Factory>;

    Factory();
    ~Factory() override;

    // BrowserContextKeyedServiceFactory overrides:
    KeyedService* BuildServiceInstanceFor(
        content::BrowserContext* context) const override;
  };
  public:
    AppMenuBridge(Profile* profile);
    AppMenuBridge(const AppMenuBridge&) = delete;
    AppMenuBridge& operator=(const AppMenuBridge&) = delete;
    ~AppMenuBridge() override;
    void Destroy(JNIEnv*, const base::android::JavaParamRef<jobject>&);

    // ProfileObserver override
    void OnProfileWillBeDestroyed(Profile* profile) override;
    // Gets a reference to Java portion of the bridge.
    base::android::ScopedJavaGlobalRef<jobject> GetJavaAppMenuBridge();


    void OpenDevTools(
		  JNIEnv* env, const base::android::JavaParamRef<jobject>&obj, 
      const base::android::JavaParamRef<jobject>& jweb_contents
    );
    void DisableProxy(
		  JNIEnv* env, const base::android::JavaParamRef<jobject>&obj
    );
    void GrantExtensionActiveTab(
		  JNIEnv* env, const base::android::JavaParamRef<jobject>& obj,
		  const base::android::JavaParamRef<jobject>& jweb_contents,
		  const base::android::JavaParamRef<jstring>& j_extension_id
    );
    jboolean IsProxyEnabled(
		  JNIEnv* env, const base::android::JavaParamRef<jobject>& obj
    );
    base::android::ScopedJavaLocalRef<jstring> GetRunningExtensions(
        JNIEnv*env, const base::android::JavaParamRef<jobject>& obj, 
        const base::android::JavaParamRef<jobject>& jweb_contents
    );
    void CallExtension(
	JNIEnv* env, const base::android::JavaParamRef<jobject>&obj,
	const base::android::JavaParamRef<jobject>& jweb_contents,
        const base::android::JavaParamRef<jstring>& j_extension_id
    );
    std::string GetRunningExtensionsInternal(content::WebContents* web_contents);

  // TabModelListObserver implementation.
  void OnTabModelAdded() override;
  void OnTabModelRemoved() override;
  void DidSelectTab(TabAndroid* tab, TabModel::TabSelectionType type)  override;
  raw_ptr<TabModel> observed_tab_model_ = nullptr;

  void CloseExtensionTabs(const std::string& extension_id);
private:
    // ExtensionActionAPI::Observer:
    void OnExtensionActionUpdated(
      extensions::ExtensionAction* extension_action,
      content::WebContents* web_contents,
      content::BrowserContext* browser_context) override;
    void OnExtensionActionAPIShuttingDown() override;

    void DestroyJavaObject();

    void CloseWalletTabs();

    std::unique_ptr<IconWithBadgeImageSource> GetIconImageSource(
      const extensions::Extension* extension,
      extensions::ExtensionAction* extension_action,
      content::WebContents* web_contents,
      const gfx::Size& size
    );
    
    base::ScopedObservation<extensions::ExtensionActionAPI, extensions::ExtensionActionAPI::Observer>
      extension_action_observation_{this};
    base::ScopedObservation<Profile, ProfileObserver> profile_observation_{this};
    raw_ptr<Profile> profile_;
    base::android::ScopedJavaGlobalRef<jobject> java_appmenu_bridge_;
    base::WeakPtrFactory<AppMenuBridge> weak_ptr_factory_;
};

#endif
