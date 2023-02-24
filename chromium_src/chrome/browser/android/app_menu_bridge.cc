#include "chrome/browser/android/app_menu_bridge.h"
#include <jni.h>
#include <string>
#include <stddef.h>
 
#include <memory>
#include <set>
#include <vector>
#include <utility>

#include "base/android/build_info.h"
#include "base/android/jni_string.h"
#include "base/strings/string_util.h"


 #include "base/android/jni_android.h"
 #include "base/android/jni_array.h"
 #include "base/android/jni_string.h"
 #include "base/android/jni_weak_ref.h"
 #include "base/feature_list.h"
 #include "base/metrics/histogram_macros.h"
 #include "base/trace_event/trace_event.h"
 #include "base/memory/weak_ptr.h"
 #include "base/values.h"
#include "base/logging.h"
#include "chrome/browser/browsing_data/browsing_data_important_sites_util.h"
 #include "chrome/browser/browsing_data/chrome_browsing_data_remover_delegate.h"
 #include "chrome/browser/engagement/important_sites_util.h"
 #include "chrome/browser/history/web_history_service_factory.h"
 #include "chrome/browser/profiles/profile_android.h"
 #include "chrome/common/channel_info.h"
 #include "chrome/common/chrome_features.h"
#include "components/sessions/content/session_tab_helper.h"
 #include "components/browsing_data/core/history_notice_utils.h"
 #include "components/browsing_data/core/pref_names.h"
 #include "components/prefs/pref_service.h"
 #include "content/public/browser/browser_context.h"
 #include "extensions/browser/extension_action_manager.h"
 #include "chrome/browser/extensions/extension_action_runner.h"
 #include "chrome/browser/extensions/extension_action_icon_factory.h"
 #include "chrome/browser/extensions/extension_context_menu_model.h"
 #include "chrome/browser/ui/toolbar/toolbar_action_view_controller.h"
 #include "extensions/browser/extension_host_observer.h"
 #include "ui/gfx/image/image.h"
 #include "base/bind.h"
 #include "base/command_line.h"
 #include "base/strings/string_util.h"
 #include "base/strings/utf_string_conversions.h"
 #include "base/threading/thread_task_runner_handle.h"
 #include "base/values.h"
 #include "base/android/jni_android.h"
 #include "base/android/jni_array.h"
 #include "base/android/jni_string.h"
 #include "chrome/browser/extensions/extension_tab_util.h"
 #include "chrome/browser/profiles/profile.h"
 #include "chrome/common/chrome_switches.h"
 #include "chrome/common/extensions/extension_constants.h"
 #include "chrome/common/url_constants.h"
 #include "components/favicon/core/favicon_service.h"
 #include "components/favicon_base/favicon_util.h"
 #include "components/pref_registry/pref_registry_syncable.h"
 #include "components/prefs/pref_service.h"
 #include "components/prefs/scoped_user_pref_update.h"
 #include "chrome/browser/extensions/tab_helper.h"
 #include "content/public/browser/navigation_controller.h"
 #include "content/public/browser/web_contents.h"
 #include "content/public/browser/web_ui.h"
 #include "content/public/common/bindings_policy.h"
 #include "extensions/browser/extension_icon_placeholder.h"
 #include "extensions/browser/extension_registry.h"
 #include "extensions/browser/extension_util.h"
 #include "extensions/browser/image_loader.h"
 #include "extensions/common/extension.h"
 #include "extensions/common/extension_icon_set.h"
 #include "extensions/common/extension_resource.h"
 #include "extensions/common/manifest_handlers/icons_handler.h"
 #include "extensions/common/manifest_handlers/incognito_info.h"
 #include "net/base/file_stream.h"
 #include "third_party/skia/include/core/SkBitmap.h"
 #include "ui/base/page_transition_types.h"
 #include "ui/gfx/codec/png_codec.h"
 #include "ui/gfx/favicon_size.h"
 #include "ui/gfx/image/image_skia.h"
 #include "chrome/browser/ui/extensions/icon_with_badge_image_source.h"
 #include "chrome/browser/ui/extensions/extension_action_view_controller.h"
 #include "ui/gfx/font_list.h"
 #include "ui/gfx/geometry/rect.h"
 #include "ui/gfx/geometry/rect_f.h"
 #include "ui/gfx/geometry/size.h"
 #include "ui/gfx/canvas.h"
 #include "ui/gfx/geometry/insets.h"
 #include "ui/gfx/image/canvas_image_source.h"
 #include "ui/gfx/skia_util.h"
 #include "ui/base/webui/web_ui_util.h"
#include "ui/color/color_provider_manager.h"
#include "ui/native_theme/native_theme.h"
#include "mises/build/android/jni_headers//AppMenuBridge_jni.h"
#include "content/public/browser/web_contents.h"
#include "chrome/browser/extensions/api/extension_action/extension_action_api.h"
#include "chrome/browser/devtools/devtools_window.h"

#include "base/scoped_observation.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/profiles/profile_observer.h"
#include "content/public/browser/browser_thread.h"
#include "extensions/common/constants.h"

#include "chrome/browser/ui/android/tab_model/tab_model.h"
#include "chrome/browser/ui/android/tab_model/tab_model_list.h"

using base::android::ConvertUTF8ToJavaString;
using base::android::ScopedJavaLocalRef;
using base::android::ScopedJavaGlobalRef;



using base::android::JavaParamRef;
 
using base::android::AttachCurrentThread;
using base::android::ConvertJavaStringToUTF8;
using base::android::ConvertUTF8ToJavaString;
using base::android::HasException;
using base::android::JavaByteArrayToByteVector;
using base::android::JavaRef;
using base::android::ScopedJavaLocalRef;
using base::android::ToJavaByteArray;
using content::BrowserThread;




namespace {
/* 
 bool PageActionWantsToRun(
     content::WebContents* web_contents, extensions::ExtensionAction* extension_action_) {
   return extension_action_->action_type() ==
              extensions::ActionInfo::TYPE_PAGE &&
          extension_action_->GetIsVisible(
              sessions::SessionTabHelper::IdForTab(web_contents).id());
 }
*/ 
constexpr base::TimeDelta kCloseDelay = base::Milliseconds(200);
 
 bool HasBeenBlocked(
     content::WebContents* web_contents, const extensions::Extension* extension) {
   extensions::ExtensionActionRunner* action_runner =
     extensions::ExtensionActionRunner::GetForWebContents(web_contents);
   return action_runner && action_runner->WantsToRun(extension);
 }
 
 bool IsEnabled(
     content::WebContents* web_contents, const extensions::Extension* extension, extensions::ExtensionAction* extension_action_) {
   return extension_action_->GetIsVisible(
              sessions::SessionTabHelper::IdForTab(web_contents).id()) ||
          HasBeenBlocked(web_contents, extension);
 }
 
 gfx::Image GetIcon(int tab_id, extensions::ExtensionAction* extension_action_) {
   gfx::Image icon = extension_action_->GetExplicitlySetIcon(tab_id);
   if (!icon.IsEmpty())
     return icon;
 
   icon = extension_action_->GetDeclarativeIcon(tab_id);
   if (!icon.IsEmpty())
     return icon;
 
   return extension_action_->GetDefaultIconImage();
 }

}  // namespace



// static
AppMenuBridge::Factory* AppMenuBridge::Factory::GetInstance() {
  return base::Singleton<AppMenuBridge::Factory>::get();
}

// static
AppMenuBridge* AppMenuBridge::Factory::GetForProfile(
    Profile* profile) {
  return static_cast<AppMenuBridge*>(
      GetInstance()->GetServiceForBrowserContext(profile->GetOriginalProfile(),
                                                 true));
}

AppMenuBridge::Factory::Factory()
    : ProfileKeyedServiceFactory("AppMenuBridge") {}

AppMenuBridge::Factory::~Factory() {}

KeyedService* AppMenuBridge::Factory::BuildServiceInstanceFor(
    content::BrowserContext* context) const {
  Profile* profile = Profile::FromBrowserContext(context);

  return new AppMenuBridge(profile);
}


AppMenuBridge::AppMenuBridge(
    Profile* profile)
    : profile_(profile), weak_ptr_factory_(this) {
  profile_observation_.Observe(profile_.get());
  extension_action_observation_.Observe(
      extensions::ExtensionActionAPI::Get(profile_));
  TabModelList::AddObserver(this);
  if (!TabModelList::models().empty()) {
    OnTabModelAdded();
  }
  java_appmenu_bridge_ = Java_AppMenuBridge_createAppMenuBridge(
      base::android::AttachCurrentThread(), reinterpret_cast<intptr_t>(this));
}


void AppMenuBridge::OnTabModelAdded() {
  LOG(INFO) << "AppMenuBridge::OnTabModelAdded ";
  if (!observed_tab_model_) {
    TabModel* model = *(TabModelList::models().begin());
    observed_tab_model_ = model;
    observed_tab_model_->AddObserver(this);
  }

}


void AppMenuBridge::DidSelectTab(TabAndroid* sel_tab, TabModel::TabSelectionType type)  {
  LOG(INFO) << "AppMenuBridge::DidSelectTab";

  
  if (!sel_tab->web_contents() || sel_tab->ExtensionWindowID() == -1) {
     base::SequencedTaskRunnerHandle::Get()->PostDelayedTask(
      FROM_HERE,
      base::BindOnce(&AppMenuBridge::CloseExtensionTabs,
                     weak_ptr_factory_.GetWeakPtr()),
      kCloseDelay);
  }

}

void AppMenuBridge::CloseExtensionTabs() {
   // close metamask popup tab when user activate any normal tab
    if (observed_tab_model_) {
      int tab_count = observed_tab_model_->GetTabCount();
      int tab_index = 0;
      for (int i =  0; i < tab_count; ++i) {
        TabAndroid* tab = observed_tab_model_->GetTabAt(tab_index);
        if (tab->ExtensionID() == metamask_extension_id) {
          observed_tab_model_->CloseTabAt(tab_index);
        } else {
          tab_index ++;
        }
      }

    }
}

void AppMenuBridge::OnTabModelRemoved() {
   LOG(INFO) << "AppMenuBridge::OnTabModelRemoved";
   if (!observed_tab_model_)
      return;

    for (const TabModel* remaining_model : TabModelList::models()) {
      if (observed_tab_model_ == remaining_model)
        return;
    }
    observed_tab_model_->RemoveObserver(this);
    observed_tab_model_ = nullptr;
}

void AppMenuBridge::OnProfileWillBeDestroyed(Profile* profile) {
  weak_ptr_factory_.InvalidateWeakPtrs();
  DestroyJavaObject();
}

ScopedJavaGlobalRef<jobject> AppMenuBridge::GetJavaAppMenuBridge() {
  return java_appmenu_bridge_;
}
void AppMenuBridge::DestroyJavaObject() {
  if (!java_appmenu_bridge_)
    return;

  Java_AppMenuBridge_destroyFromNative(
      AttachCurrentThread(), ScopedJavaLocalRef<jobject>(java_appmenu_bridge_));
}

AppMenuBridge::~AppMenuBridge() {
  if (profile_) {
    DCHECK(profile_observation_.IsObservingSource(profile_.get()));
    profile_observation_.Reset();
  }
}


void AppMenuBridge::Destroy(JNIEnv*, const JavaParamRef<jobject>&) {
  delete this;
}



ScopedJavaLocalRef<jobject> JNI_AppMenuBridge_GetForProfile(
    JNIEnv* env,
    const JavaParamRef<jobject>& j_profile) {
  DCHECK_CURRENTLY_ON(BrowserThread::UI);

  Profile* profile = ProfileAndroid::FromProfileAndroid(j_profile);
  if (!profile)
    return nullptr;

  AppMenuBridge* appmenu_bridge = AppMenuBridge::Factory::GetForProfile(profile);

  return ScopedJavaLocalRef(appmenu_bridge->GetJavaAppMenuBridge());
}

 
 std::unique_ptr<IconWithBadgeImageSource> AppMenuBridge::GetIconImageSource(
     const extensions::Extension* extension,
     extensions::ExtensionAction* extension_action_,
     content::WebContents* web_contents,
     const gfx::Size& size) {
   int tab_id = sessions::SessionTabHelper::IdForTab(web_contents).id();
   auto get_color_provider_callback = base::BindRepeating(
      [](base::WeakPtr<content::WebContents> weak_web_contents) {
        return weak_web_contents
                   ? &weak_web_contents->GetColorProvider()
                   : ui::ColorProviderManager::Get().GetColorProviderFor(
                         ui::NativeTheme::GetInstanceForNativeUi()
                             ->GetColorProviderKey(nullptr));
      },
      web_contents ? web_contents->GetWeakPtr()
                   : base::WeakPtr<content::WebContents>());
   std::unique_ptr<IconWithBadgeImageSource> image_source(
       new IconWithBadgeImageSource(size, std::move(get_color_provider_callback)));
 
   GetIcon(tab_id, extension_action_);
   image_source->SetIcon(GetIcon(tab_id, extension_action_));
 
   std::unique_ptr<IconWithBadgeImageSource::Badge> badge;
   std::string badge_text = extension_action_->GetExplicitlySetBadgeText(tab_id);
   if (!badge_text.empty()) {
     badge.reset(new IconWithBadgeImageSource::Badge(
             badge_text,
             extension_action_->GetBadgeTextColor(tab_id),
             extension_action_->GetBadgeBackgroundColor(tab_id)));
   }
   image_source->SetBadge(std::move(badge));
 
   // If the extension doesn't want to run on the active web contents, we
   // grayscale it to indicate that.
   image_source->set_grayscale(!IsEnabled(web_contents, extension, extension_action_));
 
   // If the action *does* want to run on the active web contents and is also
   // overflowed, we add a decoration so that the user can see which overflowed
   // action wants to run (since they wouldn't be able to see the change from
   // grayscale to color).
  // bool is_overflow = false;
 
   bool has_blocked_actions = HasBeenBlocked(web_contents, extension);
 //  image_source->set_state(state);
   image_source->set_paint_blocked_actions_decoration(has_blocked_actions);
   //image_source->set_paint_page_action_decoration(
   //    !has_blocked_actions && is_overflow &&
   //    PageActionWantsToRun(web_contents, extension_action_));
 
   return image_source;
 }


void AppMenuBridge::OpenDevTools(
		JNIEnv* env, const base::android::JavaParamRef<jobject>&obj, const base::android::JavaParamRef<jobject>& jweb_contents){
  LOG(INFO) << "[Mises] AppMenuBridge::OpenDevTools";
  content::WebContents* web_contents = content::WebContents::FromJavaWebContents(jweb_contents);
  if (!DevToolsWindow::IsDevToolsWindow(web_contents))
    DevToolsWindow::OpenDevToolsWindow(web_contents);
};


void AppMenuBridge::DisableProxy(
		JNIEnv* env, const base::android::JavaParamRef<jobject>&obj){
  LOG(INFO) << "[Mises] AppMenuBridge::DisableProxy";
};

base::android::ScopedJavaLocalRef<jstring> AppMenuBridge::GetRunningExtensions(
		JNIEnv*env, const base::android::JavaParamRef<jobject>& obj,
		const base::android::JavaParamRef<jobject>& jweb_contents){
  std::string exts;
  LOG(INFO) << "[Mises] AppMenuBridge::GetRunningExtensions";
  content::WebContents* web_contents = content::WebContents::FromJavaWebContents(jweb_contents);
  exts = GetRunningExtensionsInternal(web_contents); 
  return ConvertUTF8ToJavaString(env, exts);
};

jboolean AppMenuBridge::IsProxyEnabled(
		JNIEnv* env, const base::android::JavaParamRef<jobject>& obj){
  LOG(INFO) << "[Mises] AppMenuBridge::IsProxyEnabled";
  return 0;
};

void AppMenuBridge::GrantExtensionActiveTab(
		JNIEnv* env, const base::android::JavaParamRef<jobject>& obj,
		const base::android::JavaParamRef<jobject>& jweb_contents,
		const base::android::JavaParamRef<jstring>& j_extension_id){
  LOG(INFO) << "[Mises] AppMenuBridge::GrantExtensionActiveTab";
  std::string extension_to_call = ConvertJavaStringToUTF8(env, j_extension_id);
  LOG(INFO) << "[Mises] Calling AppMenu::GrantExtensionActiveTab: " << extension_to_call;
 
  extensions::ExtensionRegistry* registry;
 
  registry = extensions::ExtensionRegistry::Get(profile_);
 
  extensions::ExtensionAction* extension_action_;
  extensions::ExtensionActionManager* manager =
      extensions::ExtensionActionManager::Get(profile_);
  const extensions::ExtensionSet& enabled_extensions = registry->enabled_extensions();
  const extensions::Extension* extension_ptr = enabled_extensions.GetByID(extension_to_call);
  if (extension_ptr) {
    extension_action_ = manager->GetExtensionAction(*extension_ptr);
    if (!extension_action_) {
      extension_action_ = manager->GetExtensionAction(*extension_ptr);
    }
    if (extension_action_) {
      content::WebContents* web_contents = content::WebContents::FromJavaWebContents(jweb_contents);
      if (web_contents != nullptr) {
        LOG(INFO) << "[Mises] Granting tab access to: " << extension_to_call;
        extensions::TabHelper::FromWebContents(web_contents)
            ->active_tab_permission_granter()
            ->GrantIfRequested(extension_ptr);
      }
    }
  }
};

void AppMenuBridge::CallExtension(
		JNIEnv* env, const base::android::JavaParamRef<jobject>&obj,
		const base::android::JavaParamRef<jobject>& jweb_contents,
    const base::android::JavaParamRef<jstring>& j_extension_id) {
  LOG(INFO) << "[Mises] AppMenuBridge::CallExtension";
  std::string extension_to_call = ConvertJavaStringToUTF8(env, j_extension_id);
  LOG(INFO) << "[Mises] Calling AppMenu::CallExtension: " << extension_to_call;
 
  // The object that will be used to get the browser action icon for us.
  // It may load the icon asynchronously (in which case the initial icon
  // returned by the factory will be transparent), so we have to observe it for
  // updates to the icon.
  // The associated ExtensionRegistry; cached for quick checking.
  extensions::ExtensionRegistry* registry;

  registry = extensions::ExtensionRegistry::Get(profile_);

  extensions::ExtensionAction* extension_action_;
  extensions::ExtensionActionManager* manager =
      extensions::ExtensionActionManager::Get(profile_);
  const extensions::ExtensionSet& enabled_extensions = registry->enabled_extensions();
  const extensions::Extension* extension_ptr = enabled_extensions.GetByID(extension_to_call);
  if (extension_ptr) {
    extension_action_ = manager->GetExtensionAction(*extension_ptr);
    if (!extension_action_) {
      extension_action_ = manager->GetExtensionAction(*extension_ptr);
    }
    if (extension_action_) {
      LOG(INFO) << "[EXTENSIONS] Dispatching extension_action_ for " << extension_to_call;
      extensions::ExtensionActionAPI* action_api = extensions::ExtensionActionAPI::Get(profile_);
      content::WebContents* web_contents = content::WebContents::FromJavaWebContents(jweb_contents);
      int tabid = extensions::ExtensionAction::kDefaultTabId;
      if (web_contents != nullptr) {
        LOG(INFO) << "[EXTENSIONS] Granting tab access to: " << extension_to_call;
        extensions::TabHelper::FromWebContents(web_contents)
            ->active_tab_permission_granter()
            ->GrantIfRequested(extension_ptr);
        tabid = sessions::SessionTabHelper::IdForTab(web_contents).id();
      }
      GURL popup = extension_action_->GetPopupUrl(tabid);
      if (popup != "") {  
        if (!TabModelList::models().empty()){
            TabModel* tab_model = TabModelList::models()[0];
            if (tab_model)
              tab_model->CreateNewTabForExtension(extension_to_call, popup, 0);
        }
      } else {
        action_api->DispatchExtensionActionClicked(*extension_action_, web_contents, extension_ptr);
        LOG(INFO) << "[EXTENSIONS] Dispatched JS extension_action_ for " << extension_to_call;
      }
    }
  }
}




std::string AppMenuBridge::GetRunningExtensionsInternal(content::WebContents* web_contents){
  LOG(INFO) << "[Mises] AppMenuBridge::GetRunningExtensionsInternal";
 
   // The object that will be used to get the browser action icon for us.
   // It may load the icon asynchronously (in which case the initial icon
   // returned by the factory will be transparent), so we have to observe it for
   // updates to the icon.
   // The associated ExtensionRegistry; cached for quick checking.
   extensions::ExtensionRegistry* registry;
 
   registry = extensions::ExtensionRegistry::Get(profile_);
 
   std::string result = "";
 
   const extensions::ExtensionSet& enabled_extensions = registry->enabled_extensions();
 
   for (const auto& extension : enabled_extensions) {
      //if (ExtensionActionAPI::GetExtensionActionVisibility(extension->id())) {

      //LOG(INFO) << "[EXTENSIONS] Found extension: " << extension->id() << " IS VISIBLE";
      extensions::ExtensionAction* extension_action_;
      extensions::ExtensionActionManager* manager =
          extensions::ExtensionActionManager::Get(profile_);
      const extensions::Extension* extension_ptr = enabled_extensions.GetByID(extension->id());
      if (extension_ptr) {
        extension_action_ = manager->GetExtensionAction(*extension_ptr);
        if (!extension_action_) {
          extension_action_ = manager->GetExtensionAction(*extension_ptr);
        }
        if (extension_action_) {
          //LOG(INFO) << "[EXTENSIONS] Got extension_action_ for " << extension->id();
          //LOG(INFO) << "[EXTENSIONS] Got access to web_contents: " << web_contents;
          std::unique_ptr<IconWithBadgeImageSource> icon_badge = GetIconImageSource(extension_ptr, extension_action_, web_contents, gfx::Size(48, 48));
          gfx::Canvas canvas(gfx::Size(48, 48), 1.0f, false);
          icon_badge->Draw(&canvas);
          //LOG(INFO) << "[EXTENSIONS] Canvas drawn";
          SkBitmap bitmap = canvas.GetBitmap();
          std::string base64_image = webui::GetBitmapDataUrl(bitmap);
          //LOG(INFO) << "[EXTENSIONS] Canvas converted to bitmap: " << base64_image << " on " << extension->short_name();
          if (extension_action_->HasPopup(sessions::SessionTabHelper::IdForTab(web_contents).id())) {
            GURL popup_url = extension_action_->GetPopupUrl(
                sessions::SessionTabHelper::IdForTab(web_contents).id());
            result += extension->name() + "\x1E" + extension->id() + "\x1E" + popup_url.spec() + "\x1E" + base64_image + "\x1F";
          } else {
            // Record separator and Unit separator in ASCII table
            result += extension->name() + "\x1E" + extension->id() + "\x1E" + "" + "\x1E" + base64_image + "\x1F";
          }
        }
      }
   }
   //LOG(INFO) << "[EXTENSIONS] Result is: " << result;
   return result;
}


void AppMenuBridge::OnExtensionActionUpdated(
    extensions::ExtensionAction* extension_action,
    content::WebContents* web_contents,
    content::BrowserContext* browser_context) {
  JNIEnv* env = base::android::AttachCurrentThread();
  //LOG(INFO) << "[Mises] AppMenuBridge::OnExtensionActionUpdated " << extension_action;
  if (extension_action) {
    int tab_id = sessions::SessionTabHelper::IdForTab(web_contents).id();
    std::string extension_id = extension_action->extension_id();
    if (extension_id == metamask_extension_id) {
      extensions::ExtensionRegistry* registry = extensions::ExtensionRegistry::Get(profile_);
      const extensions::ExtensionSet& enabled_extensions = registry->enabled_extensions();
      const extensions::Extension* extension_ptr = enabled_extensions.GetByID(extension_id);
      //LOG(INFO) << "[Mises] AppMenuBridge::OnExtensionActionUpdated " << extension_action->GetDNRActionCount(tab_id) << "," << extension_action->GetExplicitlySetBadgeText(tab_id);
      if (extension_ptr && !extension_action->GetExplicitlySetBadgeText(tab_id).empty()) {
        std::unique_ptr<IconWithBadgeImageSource> icon_badge = GetIconImageSource(extension_ptr, extension_action, web_contents, gfx::Size(40, 40));
        gfx::Canvas canvas(gfx::Size(40, 40), 1.0f, false);
        icon_badge->Draw(&canvas);
        SkBitmap bitmap = canvas.GetBitmap();
        std::string base64_image = webui::GetBitmapDataUrl(bitmap);
        Java_AppMenuBridge_updateExtensionMenuIcon(env, ScopedJavaLocalRef<jobject>(java_appmenu_bridge_), ConvertUTF8ToJavaString(env, base64_image));
      } else {
        Java_AppMenuBridge_updateExtensionMenuIcon(env, ScopedJavaLocalRef<jobject>(java_appmenu_bridge_),  NULL);
      }
    }
  }
}

void AppMenuBridge::OnExtensionActionAPIShuttingDown() {
  extension_action_observation_.Reset();
}

/*
void AppMenuBridge::DisplayNewExtensionEventOnUIThread(extensions::ExtensionAction* extension_action) {
      if (profile_ != nullptr &&
          GetWebContentsForProfile(profile_) != nullptr) {
        web_contents_ = GetWebContentsForProfile(profile_)->GetWeakPtr();
      } else {
        web_contents_ = nullptr;
      }
      std::unique_ptr<messages::MessageWrapper> message =
          std::make_unique<messages::MessageWrapper>(
              messages::MessageIdentifier::SEND_TAB_TO_SELF);

      message->SetActionClick(base::BindOnce(
          &AppMenuBridge::OnMessageOpened,
          weak_factory_.GetWeakPtr(), extension_action->extension_id()));
      message->SetDismissCallback(base::BindOnce(
          &AppMenuBridge::OnMessageDismissed,
          weak_factory_.GetWeakPtr(), message.get()));

      message->SetTitle(
          l10n_util::GetStringFUTF16(IDS_SEND_TAB_TO_SELF_MESSAGE,
                                     base::UTF8ToUTF16(entry.GetDeviceName())));
      message->SetDescription(
          url_formatter::FormatUrlForSecurityDisplay(entry.GetURL()));
      message->SetDescriptionMaxLines(1);
      message->SetPrimaryButtonText(
          l10n_util::GetStringUTF16(IDS_SEND_TAB_TO_SELF_MESSAGE_OPEN));
      message->SetIconResourceId(
          ResourceMapper::MapToJavaDrawableId(IDR_SEND_TAB_TO_SELF));

      // TODO(crbug.com/1220129): A valid WebContents shouldn't be needed here.
      if (web_contents_) {
        messages::MessageDispatcherBridge::Get()->EnqueueWindowScopedMessage(
            message.get(), web_contents_->GetTopLevelNativeWindow(),
            messages::MessagePriority::kNormal);
        queued_messages_.push_back(std::move(message));
      } 
}
*/

