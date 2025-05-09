/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/ntp_background_images/browser/ntp_background_images_service.h"

#include <algorithm>
#include <memory>
#include <utility>

#include "base/functional/bind.h"
#include "base/command_line.h"
#include "base/feature_list.h"
#include "base/files/file_util.h"
#include "base/json/json_reader.h"
#include "base/path_service.h"
#include "base/strings/stringprintf.h"
#include "base/task/thread_pool.h"
#include "mises/components/mises_component_updater/browser/mises_on_demand_updater.h"
#include "mises/components/brave_referrals/browser/brave_referrals_service.h"
#include "mises/components/brave_referrals/buildflags/buildflags.h"
#include "mises/components/brave_referrals/common/pref_names.h"
#include "mises/components/l10n/common/locale_util.h"
#include "mises/components/ntp_background_images/browser/features.h"
#include "mises/components/ntp_background_images/browser/ntp_background_images_component_installer.h"
#include "mises/components/ntp_background_images/browser/ntp_background_images_data.h"
#include "mises/components/ntp_background_images/browser/ntp_sponsored_images_data.h"
#include "mises/components/ntp_background_images/browser/sponsored_images_component_data.h"
#include "mises/components/ntp_background_images/browser/switches.h"
#include "mises/components/ntp_background_images/browser/url_constants.h"
#include "mises/components/ntp_background_images/common/pref_names.h"
#include "components/component_updater/component_updater_service.h"
#include "components/prefs/pref_registry_simple.h"
#include "components/prefs/pref_service.h"

using mises_component_updater::MisesOnDemandUpdater;

namespace ntp_background_images {

namespace {

constexpr int kSIComponentUpdateCheckIntervalMins = 15;
constexpr char kNTPManifestFile[] = "photo.json";
constexpr char kNTPSRMappingTableFile[] = "mapping-table.json";

constexpr char kNTPSRMappingTableComponentPublicKey[] = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp7IWv7wzH/KLrxx7BKWOIIUMDylQNzxwM5Fig2WHc16BoMW9Kaya/g17Bpfp0YIvxdcmDBcB9kFALqQLxi1WQfa9d7YxqcmAGUKo407RMwEa6dQVkIPMFz2ZPGSfFgr526gYOqWh3Q4h8oN94qxBLgFyT25SMK5zQDGyq96ntME4MQRNwpDBUv7DDK7Npwe9iE8cBgzYTvf0taAFn2ZZi1RhS0RzpdynucpKosnc0sVBLTXy+HDvnMr+77T48zM0YmpjIh8Qmrp9CNbKzZUsZzNfnHpL9IZnjwQ51EOYdPGX2r1obChVZN19HzpK5scZEMRKoCMfCepWpEkMSIoPzQIDAQAB";  // NOLINT
constexpr char kNTPSRMappingTableComponentID[] =
    "heplpbhjcbmiibdlchlanmdenffpiibo";
constexpr char kNTPSRMappingTableComponentName[] =
    "NTP Super Referral mapping table";

std::string GetMappingTableData(const base::FilePath& installed_dir) {
  std::string contents;
  const auto json_path = installed_dir.AppendASCII(kNTPSRMappingTableFile);
  base::ReadFileToString(json_path, &contents);
  return contents;
}

// If registered component is for sponsored images wallpaper, it has photo.json
// in |installed_dir|. Otherwise, it has data.json for super referral.
// This methods cache super referral's favicon data because that favicon images
// could be used after campaign ends.
// And return manifest json string.
std::string HandleComponentData(const base::FilePath& installed_dir) {
  base::FilePath json_path = installed_dir.AppendASCII(kNTPManifestFile);
  std::string contents;

  if (json_path.empty()) {
    NOTREACHED_IN_MIGRATION() << __func__ << ": Can't find valid manifest file in "
                             << installed_dir;
    return contents;
  }

  bool success = base::ReadFileToString(json_path, &contents);
  if (!success || contents.empty()) {
    DVLOG(2) << __func__ << ": cannot read json file " << json_path;
    return contents;
  }

  return contents;
}

}  // namespace

// static
void NTPBackgroundImagesService::RegisterLocalStatePrefs(
    PrefRegistrySimple* registry) {
  registry->RegisterDictionaryPref(
      prefs::kNewTabPageCachedSuperReferralComponentInfo);
  registry->RegisterStringPref(
      prefs::kNewTabPageCachedSuperReferralComponentData, std::string());
  registry->RegisterStringPref(
      prefs::kNewTabPageCachedSuperReferralCode, std::string());
  registry->RegisterBooleanPref(
      prefs::kNewTabPageGetInitialSRComponentInProgress, false);
}

NTPBackgroundImagesService::NTPBackgroundImagesService(
    component_updater::ComponentUpdateService* cus,
    PrefService* local_pref)
    : component_update_service_(cus),
      local_pref_(local_pref),
      weak_factory_(this) {
}

NTPBackgroundImagesService::~NTPBackgroundImagesService() = default;

void NTPBackgroundImagesService::Init() {
  // Flag override for testing or demo purposes
  base::FilePath forced_local_path(
      base::CommandLine::ForCurrentProcess()->GetSwitchValueNative(
          switches::kNTPSponsoredImagesDataPathForTesting));
  if (!forced_local_path.empty()) {
    test_data_used_ = true;
    DVLOG(2) << __func__ << ": NTP SI test data will be loaded"
             << " from local path at: " << forced_local_path.LossyDisplayName();
    OnSponsoredComponentReady(false, forced_local_path);
  } else {
    RegisterBackgroundImagesComponent();
    RegisterSponsoredImagesComponent();
  }

#if BUILDFLAG(ENABLE_BRAVE_REFERRALS)
  if (base::FeatureList::IsEnabled(features::kBraveNTPSuperReferralWallpaper)) {
    // Flag override for testing or demo purposes
    base::FilePath forced_local_path_super_referral(
        base::CommandLine::ForCurrentProcess()->GetSwitchValueNative(
            switches::kNTPSuperReferralDataPathForTesting));
    if (!forced_local_path_super_referral.empty()) {
      test_data_used_ = true;
      DVLOG(2) << __func__ << ": NTP SR test data will be loaded"
               << " from local path at: "
               << forced_local_path_super_referral.LossyDisplayName();
      OnSponsoredComponentReady(false, forced_local_path_super_referral);
    } else {
      CheckSuperReferralComponent();
    }
  }
#endif
}

void NTPBackgroundImagesService::CheckNTPSIComponentUpdateIfNeeded() {
  // It means component is not ready.
  if (last_update_check_time_.is_null())
    return;

  // If previous update check is missed, do update check now.
  if (base::Time::Now() - last_update_check_time_ >
      base::Minutes(kSIComponentUpdateCheckIntervalMins)) {
    si_update_check_callback_.Run();
  }
}

void NTPBackgroundImagesService::CheckImagesComponentUpdate(
    const std::string& component_id) {
  DVLOG(2) << __func__ << ": Check NTP Images component update";

  last_update_check_time_ = base::Time::Now();
  MisesOnDemandUpdater::GetInstance()->OnDemandUpdate(component_id);
}

void NTPBackgroundImagesService::RegisterBackgroundImagesComponent() {
  DVLOG(2) << __func__ << ": Start NTP BI component";
  RegisterNTPBackgroundImagesComponent(
      component_update_service_,
      base::BindRepeating(&NTPBackgroundImagesService::OnComponentReady,
                          weak_factory_.GetWeakPtr()));
}

void NTPBackgroundImagesService::RegisterSponsoredImagesComponent() {
  const auto& data = GetSponsoredImagesComponentData(
      brave_l10n::GetDefaultISOCountryCodeString());
  if (!data) {
    DVLOG(2) << __func__ << ": Not support NTP SI component for "
             << brave_l10n::GetDefaultLocaleString();
    return;
  }

  DVLOG(2) << __func__ << ": Start NTP SI component";
  RegisterNTPSponsoredImagesComponent(
      component_update_service_, data->component_base64_public_key,
      data->component_id,
      base::StringPrintf("NTP Sponsored Images (%s)", data->region.c_str()),
      base::BindRepeating(
          &NTPBackgroundImagesService::OnSponsoredComponentReady,
          weak_factory_.GetWeakPtr(), false));
  // SI component checks update more frequently than other components.
  // By default, browser check update status every 5 hours.
  // However, this background interval is too long for SI. Use 15mins interval.
  si_update_check_callback_ = base::BindRepeating(
      &NTPBackgroundImagesService::CheckImagesComponentUpdate,
      base::Unretained(this), data->component_id);

  last_update_check_time_ = base::Time::Now();
  si_update_check_timer_.Start(
      FROM_HERE, base::Minutes(kSIComponentUpdateCheckIntervalMins),
      si_update_check_callback_);
}

void NTPBackgroundImagesService::CheckSuperReferralComponent() {
  const auto& value =
      local_pref_->GetDict(prefs::kNewTabPageCachedSuperReferralComponentInfo);
  // If we have valid cached SR component info, it means this install is valid
  // SR.
  if (IsValidSuperReferralComponentInfo(value)) {
    RegisterSuperReferralComponent();
    const std::string cached_data = local_pref_->GetString(
        prefs::kNewTabPageCachedSuperReferralComponentData);
    if (!cached_data.empty()) {
      DVLOG(2) << __func__ << ": Initialized SR Data from cache.";
      sr_images_data_ = std::make_unique<NTPSponsoredImagesData>(
          cached_data, sr_installed_dir_);
    }
    return;
  }

  if (local_pref_->FindPreference(
          prefs::kNewTabPageCachedSuperReferralComponentInfo)->
              IsDefaultValue()) {
    // At first fresh launch, we should finish initial component downloading to
    // set initial state properly.
    // But browser could be shutdown accidently before getting it anytime.
    // If this happens, we have to handle this abnormal situation strictly.
    // If not, this install will be act as a non SR install forever.
    // To resolve that situation,
    // |kNewTabPageGetInitialSRComponentInProgress| introduced.
    // If |kReferralCheckedForPromoCodeFile| or |kReferralInitialization|
    // is true and |kNewTabPageCheckingMappingTableInProgress| is false,
    // this means not first launch. Then, we can mark this install as non-SR.
    // If both (|kReferralCheckedForPromoCodeFile| or |kReferralInitialization|)
    // and |kNewTabPageCheckingMappingTableInProgress| are true,
    // browser had some trouble at first run.
    // If |kNewTabPageGetInitialSRComponentInProgress| is true, we assume that
    // initial component downloading is in-progress
    // So, We will try initialization again.
    // If referral code is non empty, that means browser is shutdown after
    // getting referal code. In this case, we should start downloading mapping
    // table.
    if ((local_pref_->GetBoolean(kReferralCheckedForPromoCodeFile) ||
         local_pref_->GetBoolean(kReferralInitialization)) &&
        !local_pref_->GetBoolean(
             prefs::kNewTabPageGetInitialSRComponentInProgress)) {
      MarkThisInstallIsNotSuperReferralForever();
      DVLOG(2) << __func__ << ": Cached SR Info is clean and Referral Service"
                           << " is not in initial state."
                           << " Mark this is not SR install.";
      return;
    }

    // If referral code is empty here, this is fresh launch.
    // If browser is crashed before fetching this install's promo code at fiirst
    // launch, it can be handled here also because code would be empty at this
    // time.
    const std::string code = GetReferralPromoCode();
    if (code.empty()) {
      local_pref_->SetBoolean(
          prefs::kNewTabPageGetInitialSRComponentInProgress,
          true);
      MonitorReferralPromoCodeChange();
      return;
    }

    // // This below code is for recover above abnormal situation - Shutdown
    // // situation before getting map table or getting initial component.
    // if (brave::BraveReferralsService::IsDefaultReferralCode(code)) {
    //   MarkThisInstallIsNotSuperReferralForever();
    // } else {
    //   // If current code is not an default one, let's check it after fetching
    //   // mapping table.
    //   DownloadSuperReferralMappingTable();
    // }
    return;
  }

  DVLOG(2) << __func__ << ": This has invalid component info.";
  DVLOG(2) << __func__ << ": In this case, this install is campaign ended super"
                       << " referral, default referral or non super referral.";
}

void NTPBackgroundImagesService::MonitorReferralPromoCodeChange() {
  DVLOG(2) << __func__ << ": Monitor referral promo code change";

  pref_change_registrar_.Init(local_pref_);
  pref_change_registrar_.Add(kReferralPromoCode,
      base::BindRepeating(&NTPBackgroundImagesService::OnPreferenceChanged,
      base::Unretained(this)));
}

void NTPBackgroundImagesService::OnPreferenceChanged(
  const std::string& pref_name) {
  DCHECK_EQ(kReferralPromoCode, pref_name);
  const std::string new_referral_code = GetReferralPromoCode();
  DVLOG(2) << __func__ << ": Got referral promo code: "
                       << new_referral_code;
  DCHECK(!new_referral_code.empty());
  if (brave::BraveReferralsService::IsDefaultReferralCode(new_referral_code)) {
    DVLOG(2) << __func__ << ": This has default referral promo code.";
    MarkThisInstallIsNotSuperReferralForever();
    return;
  }

  DVLOG(2) << __func__ << ": This has non default referral promo code."
                       << " Let's check this code is super referral or not"
                       << " after downloading mapping table.";
  DownloadSuperReferralMappingTable();
}

void NTPBackgroundImagesService::RegisterSuperReferralComponent() {
  DVLOG(2) << __func__ << ": Register NTP SR component";

  std::string public_key;
  std::string id;
  std::string theme_name;
  if (initial_sr_component_info_) {
    public_key = *initial_sr_component_info_->FindString(kPublicKey);
    id = *initial_sr_component_info_->FindString(kComponentIDKey);
    theme_name = *initial_sr_component_info_->FindString(kThemeNameKey);
  } else {
    const auto& value = local_pref_->GetDict(
        prefs::kNewTabPageCachedSuperReferralComponentInfo);
    public_key = *value.FindString(kPublicKey);
    id = *value.FindString(kComponentIDKey);
    theme_name = *value.FindString(kThemeNameKey);
  }

  RegisterNTPSponsoredImagesComponent(
      component_update_service_, public_key, id,
      base::StringPrintf("NTP Super Referral (%s)", theme_name.c_str()),
      base::BindRepeating(
          &NTPBackgroundImagesService::OnSponsoredComponentReady,
          weak_factory_.GetWeakPtr(), true));
}

void NTPBackgroundImagesService::DownloadSuperReferralMappingTable() {
  DVLOG(2) << __func__ << ": Try to download super referral mapping table.";

  if (!component_update_service_)
    return;

  RegisterNTPSponsoredImagesComponent(
      component_update_service_, kNTPSRMappingTableComponentPublicKey,
      kNTPSRMappingTableComponentID, kNTPSRMappingTableComponentName,
      base::BindRepeating(
          &NTPBackgroundImagesService::OnMappingTableComponentReady,
          weak_factory_.GetWeakPtr()));
}

void NTPBackgroundImagesService::OnMappingTableComponentReady(
    const base::FilePath& installed_dir) {
  if (!local_pref_->FindPreference(
          prefs::kNewTabPageCachedSuperReferralComponentInfo)->
              IsDefaultValue()) {
    DVLOG(2) << __func__
             << ": We don't need to handle mapping table update now.";
    return;
  }

  base::ThreadPool::PostTaskAndReplyWithResult(
      FROM_HERE, {base::MayBlock()},
      base::BindOnce(&GetMappingTableData, installed_dir),
      base::BindOnce(&NTPBackgroundImagesService::OnGetMappingTableData,
                     weak_factory_.GetWeakPtr()));
}

void NTPBackgroundImagesService::OnGetMappingTableData(
    const std::string& json_string) {
  if (json_string.empty()) {
    DVLOG(2) << __func__ << ": Mapping table is empty.";
    return;
  }

  std::optional<base::Value> mapping_table_value =
      base::JSONReader::Read(json_string);

  if (!mapping_table_value) {
    DVLOG(2) << __func__ << ": has invalid mapping table.";
    return;
  }

  if (!mapping_table_value->is_dict()) {
    DVLOG(2) << __func__ << ": Mapping table is empty.";
    return;
  }

  DVLOG(2) << __func__ << ": Downloaded valid mapping table.";

  if (base::Value::Dict* value =
          mapping_table_value->GetDict().FindDict(GetReferralPromoCode())) {
    DVLOG(2) << __func__
             << ": This is super referral. Cache SR's referral code";
    initial_sr_component_info_ = std::move(*value);
    RegisterSuperReferralComponent();
    local_pref_->SetString(prefs::kNewTabPageCachedSuperReferralCode,
                           GetReferralPromoCode());
    return;
  }

  DVLOG(2) << __func__ << ": This is non super referral.";
  MarkThisInstallIsNotSuperReferralForever();
}

void NTPBackgroundImagesService::AddObserver(Observer* observer) {
  observer_list_.AddObserver(observer);
}

void NTPBackgroundImagesService::RemoveObserver(Observer* observer) {
  observer_list_.RemoveObserver(observer);
}

bool NTPBackgroundImagesService::HasObserver(Observer* observer) {
  return observer_list_.HasObserver(observer);
}

NTPBackgroundImagesData* NTPBackgroundImagesService::GetBackgroundImagesData()
    const {
  if (bi_images_data_ && bi_images_data_->IsValid()) {
    return bi_images_data_.get();
  }

  return nullptr;
}

NTPSponsoredImagesData* NTPBackgroundImagesService::GetBrandedImagesData(
    bool super_referral) const {
  const bool is_sr_enabled =
      base::FeatureList::IsEnabled(features::kBraveNTPSuperReferralWallpaper);
  if (is_sr_enabled) {
    if (super_referral) {
      if (sr_images_data_ && sr_images_data_->IsValid())
        return sr_images_data_.get();
      return nullptr;
    }

    // Don't give SI data until we can confirm this is not SR.
    // W/o this check, NTP could show SI images before getting SR data at first
    // run.
    if (local_pref_
            ->FindPreference(prefs::kNewTabPageCachedSuperReferralComponentInfo)
            ->IsDefaultValue()) {
      return nullptr;
    }
  } else {
    if (super_referral)
      return nullptr;
  }

  if (si_images_data_ && si_images_data_->IsValid())
    return si_images_data_.get();

  return nullptr;
}

void NTPBackgroundImagesService::OnComponentReady(
    const base::FilePath& installed_dir) {
  bi_installed_dir_ = installed_dir;

  DVLOG(2) << __func__ << ": NTP BI Component is ready";

  base::ThreadPool::PostTaskAndReplyWithResult(
      FROM_HERE, {base::MayBlock()},
      base::BindOnce(&HandleComponentData, installed_dir),
      base::BindOnce(&NTPBackgroundImagesService::OnGetComponentJsonData,
                     weak_factory_.GetWeakPtr()));
}

void NTPBackgroundImagesService::OnGetComponentJsonData(
    const std::string& json_string) {
  bi_images_data_ =
      std::make_unique<NTPBackgroundImagesData>(json_string, bi_installed_dir_);

  for (auto& observer : observer_list_) {
    observer.OnUpdated(bi_images_data_.get());
  }
}

void NTPBackgroundImagesService::OnSponsoredComponentReady(
    bool is_super_referral,
    const base::FilePath& installed_dir) {
  if (is_super_referral)
    sr_installed_dir_ = installed_dir;
  else
    si_installed_dir_ = installed_dir;

  DVLOG(2) << __func__ << (is_super_referral ? ": NPT SR Component is ready"
                                             : ": NTP SI Component is ready");

  base::ThreadPool::PostTaskAndReplyWithResult(
      FROM_HERE, {base::MayBlock()},
      base::BindOnce(&HandleComponentData, installed_dir),
      base::BindOnce(
          &NTPBackgroundImagesService::OnGetSponsoredComponentJsonData,
          weak_factory_.GetWeakPtr(), is_super_referral));
}

void NTPBackgroundImagesService::OnGetSponsoredComponentJsonData(
    bool is_super_referral,
    const std::string& json_string) {
  if (is_super_referral) {
    local_pref_->SetBoolean(
          prefs::kNewTabPageGetInitialSRComponentInProgress,
          false);
    sr_images_data_ = std::make_unique<NTPSponsoredImagesData>(
        json_string, sr_installed_dir_);
    // |initial_sr_component_info_| has proper data only for initial component
    // downloading. After that, it's empty. In test, it's also empty.
    if (initial_sr_component_info_) {
      local_pref_->SetDict(prefs::kNewTabPageCachedSuperReferralComponentInfo,
                           std::move(*initial_sr_component_info_));
    }
    local_pref_->SetString(prefs::kNewTabPageCachedSuperReferralComponentData,
                           json_string);
  } else {
    si_images_data_ = std::make_unique<NTPSponsoredImagesData>(
        json_string, si_installed_dir_);
  }

  if (is_super_referral && !sr_images_data_->IsValid()) {
    DVLOG(2) << __func__ << ": NTP SR campaign ends.";
    UnRegisterSuperReferralComponent();
    MarkThisInstallIsNotSuperReferralForever();
    return;
  }

  for (auto& observer : observer_list_) {
    observer.OnUpdated(is_super_referral ? sr_images_data_.get()
                                         : si_images_data_.get());
  }
}

void NTPBackgroundImagesService::MarkThisInstallIsNotSuperReferralForever() {
  local_pref_->SetDict(prefs::kNewTabPageCachedSuperReferralComponentInfo,
                       base::Value::Dict());
  local_pref_->SetString(prefs::kNewTabPageCachedSuperReferralComponentData,
                         std::string());
  local_pref_->SetString(prefs::kNewTabPageCachedSuperReferralCode,
                         std::string());

  for (auto& observer : observer_list_)
    observer.OnSuperReferralEnded();
}

bool NTPBackgroundImagesService::IsValidSuperReferralComponentInfo(
    const base::Value::Dict& component_info) const {
  return component_info.FindString(kPublicKey) &&
         component_info.FindString(kComponentIDKey) &&
         component_info.FindString(kThemeNameKey);
}

void NTPBackgroundImagesService::UnRegisterSuperReferralComponent() {
  if (!component_update_service_)
    return;

  const auto& value =
      local_pref_->GetDict(prefs::kNewTabPageCachedSuperReferralComponentInfo);
  const std::string sr_component_id = *value.FindString(kComponentIDKey);
  DVLOG(2) << __func__ << ": Unregister NTP SR component";
  component_update_service_->UnregisterComponent(sr_component_id);
}

std::string NTPBackgroundImagesService::GetReferralPromoCode() const {
  return local_pref_->GetString(kReferralPromoCode);
}

bool NTPBackgroundImagesService::IsSuperReferral() const {
  const auto& value =
      local_pref_->GetDict(prefs::kNewTabPageCachedSuperReferralComponentInfo);
  return base::FeatureList::IsEnabled(
             features::kBraveNTPSuperReferralWallpaper) &&
         IsValidSuperReferralComponentInfo(value);
}

std::string NTPBackgroundImagesService::GetSuperReferralThemeName() const {
  std::string theme_name;
  const auto& value =
      local_pref_->GetDict(prefs::kNewTabPageCachedSuperReferralComponentInfo);
  if (base::FeatureList::IsEnabled(features::kBraveNTPSuperReferralWallpaper) &&
      IsValidSuperReferralComponentInfo(value)) {
    theme_name = *value.FindString(kThemeNameKey);
  }

  return theme_name;
}

std::string NTPBackgroundImagesService::GetSuperReferralCode() const {
  return local_pref_->GetString(prefs::kNewTabPageCachedSuperReferralCode);
}

}  // namespace ntp_background_images
