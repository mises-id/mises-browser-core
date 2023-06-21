// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "chrome/browser/search/instant_service.h"

#include <stddef.h>
#include <string>

#include "base/functional/bind.h"
#include "base/functional/callback.h"
#include "base/files/file_util.h"
#include "base/memory/ptr_util.h"
#include "base/observer_list.h"
#include "base/path_service.h"
#include "base/scoped_observation.h"
#include "base/strings/string_util.h"
#include "base/strings/utf_string_conversions.h"
#include "base/task/thread_pool.h"
#include "base/time/clock.h"
#include "build/build_config.h"
#include "chrome/browser/chrome_notification_types.h"
#include "chrome/browser/ntp_tiles/chrome_most_visited_sites_factory.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/search/instant_service_factory.h"
#include "chrome/browser/search/instant_service_observer.h"
#include "chrome/browser/search/most_visited_iframe_source.h"
#include "chrome/browser/search/search.h"
#include "chrome/browser/themes/theme_properties.h"
#include "chrome/browser/themes/theme_service.h"
#include "chrome/browser/themes/theme_service_factory.h"
#include "chrome/browser/ui/webui/favicon_source.h"
#include "chrome/browser/ui/webui/theme_source.h"
#include "chrome/common/chrome_paths.h"
#include "chrome/common/pref_names.h"
#include "chrome/common/search/search.mojom.h"
#include "chrome/common/url_constants.h"
#include "chrome/grit/theme_resources.h"
#include "components/favicon_base/favicon_url_parser.h"
#include "components/ntp_tiles/constants.h"
#include "components/prefs/pref_registry_simple.h"
#include "components/prefs/pref_service.h"
#include "components/search/ntp_features.h"
#include "components/search/search_provider_observer.h"
#include "components/sync_preferences/pref_service_syncable.h"
#include "content/public/browser/browser_context.h"
#include "content/public/browser/browser_task_traits.h"
#include "content/public/browser/browser_thread.h"
#include "content/public/browser/notification_service.h"
#include "content/public/browser/notification_types.h"
#include "content/public/browser/render_process_host.h"
#include "content/public/browser/url_data_source.h"
#include "extensions/browser/extension_registry.h"
#include "extensions/common/extension.h"
#include "mojo/public/cpp/bindings/associated_remote.h"
#include "ui/gfx/color_palette.h"
#include "ui/gfx/color_utils.h"


#include "chrome/browser/search/new_tab_page_source.h"
#include "extensions/browser/extension_action.h"
#include "extensions/browser/extension_action_manager.h"
#include "extensions/common/manifest_handlers/icons_handler.h"
#include "chrome/browser/extensions/tab_helper.h"
#include "chrome/browser/extensions/api/extension_action/extension_action_api.h"
#include "chrome/browser/ui/webui/extensions/extension_icon_source.h"
#include "ui/gfx/image/image.h"
#include "ui/gfx/image/image_skia.h"
#include "ui/gfx/image/image_skia_rep.h"
#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/android/tab_model/tab_model.h"
#include "chrome/browser/ui/android/tab_model/tab_model_list.h"
#endif
#include "chrome/browser/history/history_service_factory.h"

InstantService::InstantService(Profile* profile)
    : profile_(profile),
      most_visited_info_(std::make_unique<InstantMostVisitedInfo>()),
      pref_service_(profile_->GetPrefs()),
      native_theme_(ui::NativeTheme::GetInstanceForNativeUi()),
      background_updated_timestamp_(base::TimeTicks::Now()) {
  //LOG(INFO) << "[Mises] InstantService::InstantService ";
  // The initialization below depends on a typical set of browser threads. Skip
  // it if we are running in a unit test without the full suite.
  if (!content::BrowserThread::CurrentlyOn(content::BrowserThread::UI))
    return;

  registrar_.Add(this,
                 content::NOTIFICATION_RENDERER_PROCESS_TERMINATED,
                 content::NotificationService::AllSources());

  most_visited_sites_ = ChromeMostVisitedSitesFactory::NewForProfile(profile_);
  if (most_visited_sites_) {
    most_visited_sites_->EnableCustomLinks(false);
    most_visited_sites_->AddMostVisitedURLsObserver(
        this, ntp_tiles::kMaxNumMostVisited);
  }

  // Listen for theme installation.
  ThemeServiceFactory::GetForProfile(profile_)->AddObserver(this);

  // TODO(crbug.com/1192394): multiple WebUI pages depend on the theme source
  // without adding it themselves. This is not causing an issue because the
  // theme source is being added here. The source should be added where it is
  // used and then the following can be removed.
  content::URLDataSource::Add(profile_,
                              std::make_unique<ThemeSource>(profile_));

  // Set up the data sources that Instant uses on the NTP.
  content::URLDataSource::Add(
      profile_, std::make_unique<FaviconSource>(
                    profile_, chrome::FaviconUrlFormat::kFaviconLegacy));
  content::URLDataSource::Add(profile_,
                              std::make_unique<MostVisitedIframeSource>());
  content::URLDataSource::Add(profile_,
                              std::make_unique<NewTabPageSource>());

  theme_observation_.Observe(native_theme_.get());
}

InstantService::~InstantService() = default;

void InstantService::AddInstantProcess(int process_id) {
  //LOG(INFO) << "[Mises] InstantService::AddInstantProcess " << process_id;
  process_ids_.insert(process_id);
}

bool InstantService::IsInstantProcess(int process_id) const {
  return process_ids_.find(process_id) != process_ids_.end();
}

void InstantService::AddObserver(InstantServiceObserver* observer) {
  observers_.AddObserver(observer);
}

void InstantService::RemoveObserver(InstantServiceObserver* observer) {
  observers_.RemoveObserver(observer);
}

void InstantService::OnNewTabPageOpened() {
  if (most_visited_sites_) {
    most_visited_sites_->Refresh();
    most_visited_sites_->RefreshTiles();
  }
}

void InstantService::OnThemeChanged() {
  theme_ = nullptr;
  UpdateNtpTheme();
}

void InstantService::DeleteMostVisitedItem(const GURL& url) {
  if (most_visited_sites_) {
    most_visited_sites_->AddOrRemoveBlockedUrl(url, true);
  }
}

void InstantService::UndoMostVisitedDeletion(const GURL& url) {
  if (most_visited_sites_) {
    most_visited_sites_->AddOrRemoveBlockedUrl(url, false);
  }
}

void InstantService::UndoAllMostVisitedDeletions() {
  if (most_visited_sites_) {
    most_visited_sites_->ClearBlockedUrls();
  }
}

void InstantService::UpdateNtpTheme() {
  SetNtpElementsNtpTheme();

  NotifyAboutNtpTheme();
}

void InstantService::UpdateMostVisitedInfo() {
  NotifyAboutMostVisitedInfo();
}

NtpTheme* InstantService::GetInitializedNtpTheme() {
  if (!theme_)
    BuildNtpTheme();
  return theme_.get();
}

void InstantService::SetNativeThemeForTesting(ui::NativeTheme* theme) {
  theme_observation_.Reset();
  native_theme_ = theme;
  theme_observation_.Observe(native_theme_.get());
}

void InstantService::Shutdown() {
  process_ids_.clear();

  if (most_visited_sites_) {
    most_visited_sites_.reset();
  }

  ThemeServiceFactory::GetForProfile(profile_)->RemoveObserver(this);
}

void InstantService::Observe(int type,
                             const content::NotificationSource& source,
                             const content::NotificationDetails& details) {
  switch (type) {
    case content::NOTIFICATION_RENDERER_PROCESS_TERMINATED: {
      content::RenderProcessHost* rph =
          content::Source<content::RenderProcessHost>(source).ptr();
      Profile* renderer_profile =
          static_cast<Profile*>(rph->GetBrowserContext());
      if (profile_ == renderer_profile)
        OnRendererProcessTerminated(rph->GetID());
      break;
    }
    default:
      NOTREACHED() << "Unexpected notification type in InstantService.";
  }
}

void InstantService::OnRendererProcessTerminated(int process_id) {
  //LOG(INFO) << "[Mises] InstantService::OnRendererProcessTerminated " << process_id;
  process_ids_.erase(process_id);
}

void InstantService::OnNativeThemeUpdated(ui::NativeTheme* observed_theme) {
  DCHECK_EQ(observed_theme, native_theme_);
  // Force the theme information to rebuild so the correct using_dark_colors
  // value is sent to the renderer.
  BuildNtpTheme();
  UpdateNtpTheme();
}

GURL InstantService::GetExtensionURL(const std::string& extension_id) {
  std::string url = extensions::kExtensionScheme;
  url += "://";
  url += extension_id;
  return GURL(url.c_str());
}

void InstantService::SearchComplete(history::QueryResults results) {
  std::vector<GURL> recent;
  //recent.push_back(GURL("chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn"));
  //recent.push_back(GURL("chrome-extension://jkpbgdgopmifmokhejofbmgdabapoefl"));
  if (!results.empty()) {
    for (const auto& item : results){
      if (item.url().SchemeIs(extensions::kExtensionScheme)) {
        //LOG(INFO) << "[Mises] InstantService::SearchComplete - recent extension: " << item.url().GetWithEmptyPath();
	      recent.push_back(item.url().GetWithEmptyPath());
      }
    }
  }
  std::vector<InstantMostVisitedItem> items;
  extensions::ExtensionRegistry* registry = extensions::ExtensionRegistry::Get(profile_);
  const extensions::ExtensionSet& enabled_extensions = registry->enabled_extensions();
  for (const auto& extension : enabled_extensions) {
    extensions::ExtensionAction* action = nullptr;
    extensions::ExtensionActionManager* manager =
             extensions::ExtensionActionManager::Get(profile_);
    const extensions::Extension* extension_ptr = enabled_extensions.GetByID(extension->id());
    if (extension_ptr) {
     action = manager->GetExtensionAction(*extension_ptr);
    }
    if (action) {
       InstantMostVisitedItem item;
       const int kDefaultTabId = extensions::ExtensionAction::kDefaultTabId;
       item.url = GetExtensionURL(extension->id());
       item.title = base::UTF8ToUTF16(extension->name());
        gfx::Image icon =
                action->GetExplicitlySetIcon(kDefaultTabId);
        if (icon.IsEmpty())
          icon = action->GetDeclarativeIcon(kDefaultTabId);
        if (icon.IsEmpty())
          icon = action->GetDefaultIconImage();
        if (!icon.IsEmpty()) {
          std::vector<gfx::ImageSkiaRep> image_reps = icon.AsImageSkia().image_reps();
          for (const gfx::ImageSkiaRep& rep : image_reps) {
            std::string base64_image = webui::GetBitmapDataUrl(rep.GetBitmap());

            item.favicon = GURL(base64_image);
          }
        }
       //LOG(INFO) << "[Mises] InstantService::SearchComplete - found extension: " << item.url;
       items.push_back(item);
    }
  }
  std::sort(
      items.begin(), items.end(),
      [&recent](const InstantMostVisitedItem& l, const InstantMostVisitedItem& r) {
        std::vector<GURL>::iterator itrl = std::find(recent.begin(), recent.end(), l.url);
        std::vector<GURL>::iterator itrr = std::find(recent.begin(), recent.end(), r.url);
        return itrl <  itrr;
  });
  recent_extensions_.clear();
  for (const auto& item : items) {
    //LOG(INFO) << "[Mises] InstantService::SearchComplete - sort extension: " << item.url;
    recent_extensions_.push_back(item);
  }
  NotifyAboutMostVisitedInfo();
}
void InstantService::OnURLsAvailable(
    const std::map<ntp_tiles::SectionType, ntp_tiles::NTPTilesVector>&
        sections) {
  DCHECK(most_visited_sites_);
  most_visited_items_.clear();
  // Use only personalized tiles for instant service.
  const ntp_tiles::NTPTilesVector& tiles =
      sections.at(ntp_tiles::SectionType::PERSONALIZED);
  for (const ntp_tiles::NTPTile& tile : tiles) {
    InstantMostVisitedItem item;
    item.url = tile.url;
    item.title = tile.title;
    item.favicon = tile.favicon_url;
    most_visited_items_.push_back(item);
  }
  std::string url_spec = extensions::kExtensionScheme;
  url_spec += "://";
  std::u16string search_text = base::UTF8ToUTF16(url_spec);
  history::QueryOptions options;
  options.max_count = 20;
  options.matching_algorithm =
	          query_parser::MatchingAlgorithm::ALWAYS_PREFIX_SEARCH;
  history::HistoryService* hs = HistoryServiceFactory::GetForProfile(
      profile_, ServiceAccessType::EXPLICIT_ACCESS);
  hs->QueryHistory(search_text, options,
                   base::BindOnce(&InstantService::SearchComplete,
                                  base::Unretained(this)),
                   &task_tracker_);
}

void InstantService::OnIconMadeAvailable(const GURL& site_url) {}

void InstantService::NotifyAboutMostVisitedInfo() {
  most_visited_info_->items.clear();
  for (const auto& item : recent_extensions_) {
    most_visited_info_->items.push_back(item);
  }
  for (const auto& item : most_visited_items_) {
    most_visited_info_->items.push_back(item);
  }
  for (InstantServiceObserver& observer : observers_)
    observer.MostVisitedInfoChanged(*most_visited_info_);
}

void InstantService::NotifyAboutNtpTheme() {
  for (InstantServiceObserver& observer : observers_)
    observer.NtpThemeChanged(*theme_);
}

void InstantService::BuildNtpTheme() {
  // Get theme information from theme service.
  theme_ = std::make_unique<NtpTheme>();

  // Get if the current theme is the default theme.
  ThemeService* theme_service = ThemeServiceFactory::GetForProfile(profile_);
  theme_->using_default_theme = theme_service->UsingDefaultTheme();

  SetNtpElementsNtpTheme();

  if (theme_service->UsingExtensionTheme()) {
    const extensions::Extension* extension =
        extensions::ExtensionRegistry::Get(profile_)
            ->enabled_extensions()
            .GetByID(theme_service->GetThemeID());
    if (extension) {
      theme_->theme_id = theme_service->GetThemeID();

      const ui::ThemeProvider& theme_provider =
          ThemeService::GetThemeProviderForProfile(profile_);
      if (theme_provider.HasCustomImage(IDR_THEME_NTP_BACKGROUND)) {
        theme_->has_theme_image = true;

        // Set theme background image horizontal alignment.
        int alignment = theme_provider.GetDisplayProperty(
            ThemeProperties::NTP_BACKGROUND_ALIGNMENT);
        if (alignment & ThemeProperties::ALIGN_LEFT)
          theme_->image_horizontal_alignment = THEME_BKGRND_IMAGE_ALIGN_LEFT;
        else if (alignment & ThemeProperties::ALIGN_RIGHT)
          theme_->image_horizontal_alignment = THEME_BKGRND_IMAGE_ALIGN_RIGHT;
        else
          theme_->image_horizontal_alignment = THEME_BKGRND_IMAGE_ALIGN_CENTER;

        // Set theme background image vertical alignment.
        if (alignment & ThemeProperties::ALIGN_TOP)
          theme_->image_vertical_alignment = THEME_BKGRND_IMAGE_ALIGN_TOP;
        else if (alignment & ThemeProperties::ALIGN_BOTTOM)
          theme_->image_vertical_alignment = THEME_BKGRND_IMAGE_ALIGN_BOTTOM;
        else
          theme_->image_vertical_alignment = THEME_BKGRND_IMAGE_ALIGN_CENTER;

        // Set theme background image tiling.
        int tiling = theme_provider.GetDisplayProperty(
            ThemeProperties::NTP_BACKGROUND_TILING);
        switch (tiling) {
          case ThemeProperties::NO_REPEAT:
            theme_->image_tiling = THEME_BKGRND_IMAGE_NO_REPEAT;
            break;
          case ThemeProperties::REPEAT_X:
            theme_->image_tiling = THEME_BKGRND_IMAGE_REPEAT_X;
            break;
          case ThemeProperties::REPEAT_Y:
            theme_->image_tiling = THEME_BKGRND_IMAGE_REPEAT_Y;
            break;
          case ThemeProperties::REPEAT:
            theme_->image_tiling = THEME_BKGRND_IMAGE_REPEAT;
            break;
        }

        theme_->has_attribution =
            theme_provider.HasCustomImage(IDR_THEME_NTP_ATTRIBUTION);
      }
    }
  }
}

// static
bool InstantService::ShouldServiceRequest(
    const GURL& url,
    content::BrowserContext* browser_context,
    int render_process_id) {
  DCHECK_CURRENTLY_ON(content::BrowserThread::UI);

  auto* instant_service = InstantServiceFactory::GetForProfile(
      static_cast<Profile*>(browser_context));

  if (!instant_service)
    return false;

  // The process_id for the navigation request will be -1. If
  // so, allow this request since it's not going to another renderer.
  return render_process_id == -1 ||
         instant_service->IsInstantProcess(render_process_id);
}

void InstantService::SetNtpElementsNtpTheme() {
  NtpTheme* theme = GetInitializedNtpTheme();
  const ui::ThemeProvider& theme_provider =
      ThemeService::GetThemeProviderForProfile(profile_);
  theme->logo_alternate = theme_provider.GetDisplayProperty(
                              ThemeProperties::NTP_LOGO_ALTERNATE) == 1;
}

void InstantService::OpenExtension(content::WebContents* web_contents, const GURL& url) {
  extensions::ExtensionRegistry* registry = extensions::ExtensionRegistry::Get(profile_);
  const extensions::ExtensionSet& enabled_extensions = registry->enabled_extensions();
  for (const auto& extension : enabled_extensions) {
    extensions::ExtensionAction* action = nullptr;
    extensions::ExtensionActionManager* manager =
             extensions::ExtensionActionManager::Get(profile_);
    const extensions::Extension* extension_ptr = enabled_extensions.GetByID(extension->id());
    if (extension_ptr) {
     action = manager->GetExtensionAction(*extension_ptr);
    }  
    if (action) {
       const int kDefaultTabId = extensions::ExtensionAction::kDefaultTabId;
       if (url == GetExtensionURL(extension->id())) {
          extensions::ExtensionActionAPI* action_api = extensions::ExtensionActionAPI::Get(profile_);
          if (web_contents != nullptr) {
            extensions::TabHelper::FromWebContents(web_contents)
              ->active_tab_permission_granter()
              ->GrantIfRequested(extension_ptr);
            
          }
          GURL popup = action->GetPopupUrl(kDefaultTabId);
          if (popup != "") {
#if BUILDFLAG(IS_ANDROID)           
            if (!TabModelList::models().empty()){
              TabModel* tab_model = TabModelList::models()[0];
              if (tab_model)
                tab_model->CreateNewTabForExtension(extension->id(), popup, 0);
            }
#endif
          } else {
            action_api->DispatchExtensionActionClicked(*action, web_contents, extension_ptr);
          }
          break;
       };
    }
  }
}
