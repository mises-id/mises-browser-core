#include "chrome/browser/ui/profile_picker.h"

#include <string>

#include "base/containers/flat_set.h"
#include "base/metrics/histogram_functions.h"
#include "base/ranges/algorithm.h"
#include "base/time/time.h"
#include "chrome/browser/browser_process.h"
#include "chrome/browser/profiles/profile_attributes_entry.h"
#include "chrome/browser/profiles/profile_attributes_storage.h"
#include "chrome/browser/profiles/profile_manager.h"
#include "chrome/browser/profiles/profiles_state.h"
#include "chrome/browser/signin/signin_util.h"
#include "chrome/browser/ui/ui_features.h"
#include "chrome/common/pref_names.h"
#include "chrome/common/webui_url_constants.h"
#include "components/prefs/pref_service.h"


const char ProfilePicker::kTaskManagerUrl[] =
    "chrome://profile-picker/task-manager";

ProfilePicker::Params::~Params() {
}

ProfilePicker::Params::Params(ProfilePicker::Params&&) = default;

ProfilePicker::Params& ProfilePicker::Params::operator=(
    ProfilePicker::Params&&) = default;

// static
ProfilePicker::Params ProfilePicker::Params::FromEntryPoint(
    EntryPoint entry_point) {
  // Use specialized constructors when available.
  DCHECK_NE(entry_point, EntryPoint::kBackgroundModeManager);
  DCHECK_NE(entry_point, EntryPoint::kLacrosSelectAvailableAccount);
  DCHECK_NE(entry_point, EntryPoint::kLacrosPrimaryProfileFirstRun);
  return ProfilePicker::Params(entry_point, GetPickerProfilePath());
}

// static
ProfilePicker::Params ProfilePicker::Params::ForBackgroundManager(
    const GURL& on_select_profile_target_url) {
  Params params(EntryPoint::kBackgroundModeManager, GetPickerProfilePath());
  params.on_select_profile_target_url_ = on_select_profile_target_url;
  return params;
}


bool ProfilePicker::Params::CanReusePickerWindow(const Params& other) const {
  return false;
}

ProfilePicker::Params::Params(EntryPoint entry_point,
                              const base::FilePath& profile_path)
    : entry_point_(entry_point), profile_path_(profile_path) {}

// static
bool ProfilePicker::Shown() {
  return false;
}

// static
bool ProfilePicker::ShouldShowAtLaunch() {
  return false;
}

void ProfilePicker::Show(Params&& params) {
}

// static
base::FilePath ProfilePicker::GetPickerProfilePath() {
  return ProfileManager::GetSystemProfilePath();
}
