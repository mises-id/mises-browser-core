#include "src/chrome/browser/signin/signin_util.cc"


namespace signin_util {

#if BUILDFLAG(IS_ANDROID)
bool ProfileSeparationEnforcedByPolicy(
    Profile* profile,
    const std::string& intercepted_account_level_policy_value) {
  std::string current_profile_account_restriction =
      profile->GetPrefs()->GetString(prefs::kManagedAccountsSigninRestriction);

  bool is_machine_level_policy = profile->GetPrefs()->GetBoolean(
      prefs::kManagedAccountsSigninRestrictionScopeMachine);

  // Enforce profile separation for all new signins if any restriction is
  // applied at a machine level.
  if (is_machine_level_policy) {
    return !current_profile_account_restriction.empty() &&
           current_profile_account_restriction != "none";
  }

  // Enforce profile separation for all new signins if "primary_account_strict"
  // is set at the user account level.
  return base::StartsWith(current_profile_account_restriction,
                          "primary_account_strict") ||
         base::StartsWith(intercepted_account_level_policy_value,
                          "primary_account");
}

bool ProfileSeparationAllowsKeepingUnmanagedBrowsingDataInManagedProfile(
    Profile* profile,
    const std::string& intercepted_account_level_policy_value) {
  std::string current_profile_account_restriction =
      profile->GetPrefs()->GetString(prefs::kManagedAccountsSigninRestriction);

  return !ProfileSeparationEnforcedByPolicy(
             profile, intercepted_account_level_policy_value) ||
         base::EndsWith(current_profile_account_restriction,
                        "keep_existing_data") ||
         base::EndsWith(intercepted_account_level_policy_value,
                        "keep_existing_data");
}

void RecordEnterpriseProfileCreationUserChoice(bool enforced_by_policy,
                                               bool created) {
  base::UmaHistogramBoolean(
      enforced_by_policy
          ? "Signin.Enterprise.WorkProfile.ProfileCreatedWithPolicySet"
          : "Signin.Enterprise.WorkProfile.ProfileCreatedwithPolicyUnset",
      created);
}

#endif  // !BUILDFLAG(IS_ANDROID)

}  // namespace signin_util
