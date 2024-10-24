#include "mises/app/mises_command_line_helper.cc"
#include "mises/app/mises_main_delegate.cc"

#include "mises/components/variations/buildflags.h"
#include "build/build_config.h"
#include "components/dom_distiller/core/dom_distiller_switches.h"
#define BasicStartupComplete BasicStartupComplete_ChromiumImpl
#include "src/chrome/app/chrome_main_delegate.cc"
#undef BasicStartupComplete



// We don't implement this as an overridden method in BraveMainDelegate because
// we need this to be executed also when running browser upstream tests, which
// rely on ChromeTestLauncherDelegate instead of BraveTestLauncherDelegate.
//
// Because of that, upstream tests won't get BraveMainDelegate instantiated and
// therefore we won't get any of the features below disabled/enabled when
// running those browser tests, which is not what we want.
std::optional<int> ChromeMainDelegate::BasicStartupComplete() {
  MisesCommandLineHelper command_line(base::CommandLine::ForCurrentProcess());
  command_line.AppendSwitch(switches::kDisableDomainReliability);
  command_line.AppendSwitch(switches::kEnableDomDistiller);
  command_line.AppendSwitch(switches::kEnableDistillabilityService);

  // if (!base::CommandLine::ForCurrentProcess()->HasSwitch(
  //         embedder_support::kOriginTrialPublicKey)) {
  //   command_line.AppendSwitchASCII(embedder_support::kOriginTrialPublicKey,
  //                                  kBraveOriginTrialsPublicKey);
  // }

  command_line.AppendSwitchASCII(switches::kLsoUrl, kDummyUrl);

  // Mises variations
  command_line.AppendSwitchASCII(variations::switches::kVariationsServerURL,
                                 BUILDFLAG(MISES_VARIATIONS_SERVER_URL));
  // Insecure fall-back for variations is set to the same (secure) URL. This is
  // done so that if VariationsService tries to fall back to insecure url the
  // check for kHttpScheme in VariationsService::MaybeRetryOverHTTP would
  // prevent it from doing so as we don't want to use an insecure fall-back.
  command_line.AppendSwitchASCII(
      variations::switches::kVariationsInsecureServerURL,
      BUILDFLAG(MISES_VARIATIONS_SERVER_URL));

  // Runtime-enabled features. To override Chromium features default state
  // please see: brave/chromium_src/base/feature_override.h
  std::unordered_set<const char*> enabled_features = {};

  // Runtime-disabled features. To override Chromium features default state
  // please see: brave/chromium_src/base/feature_override.h
  std::unordered_set<const char*> disabled_features = {};


  command_line.AppendFeatures(enabled_features, disabled_features);

  return ChromeMainDelegate::BasicStartupComplete_ChromiumImpl();
}