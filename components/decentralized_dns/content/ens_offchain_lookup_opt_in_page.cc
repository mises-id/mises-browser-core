/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/decentralized_dns/content/ens_offchain_lookup_opt_in_page.h"

#include <ostream>
#include <utility>
#include <vector>

#include "base/notreached.h"
#include "base/strings/string_number_conversions.h"
#include "base/strings/string_util.h"
#include "base/strings/utf_string_conversions.h"
#include "base/values.h"
#include "mises/components/decentralized_dns/content/ens_offchain_lookup_interstitial_controller_client.h"
#include "mises/components/decentralized_dns/core/utils.h"
#include "mises/components/l10n/common/localization_util.h"
#include "components/grit/mises_components_resources.h"
#include "components/grit/mises_components_strings.h"
#include "components/security_interstitials/content/security_interstitial_controller_client.h"

namespace decentralized_dns {

// static
const security_interstitials::SecurityInterstitialPage::TypeID
    EnsOffchainLookupOptInPage::kTypeForTesting =
        &EnsOffchainLookupOptInPage::kTypeForTesting;

EnsOffchainLookupOptInPage::EnsOffchainLookupOptInPage(
    content::WebContents* web_contents,
    const GURL& request_url,
    std::unique_ptr<
        security_interstitials::SecurityInterstitialControllerClient>
        controller)
    : security_interstitials::SecurityInterstitialPage(web_contents,
                                                       request_url,
                                                       std::move(controller)),
      request_url_(request_url) {}

EnsOffchainLookupOptInPage::~EnsOffchainLookupOptInPage() = default;

void EnsOffchainLookupOptInPage::CommandReceived(const std::string& command) {
  if (command == "\"pageLoadComplete\"") {
    // content::WaitForRenderFrameReady sends this message when the page
    // load completes. Ignore it.
    return;
  }

  int cmd = 0;
  bool retval = base::StringToInt(command, &cmd);
  DCHECK(retval);

  switch (cmd) {
    case security_interstitials::CMD_DONT_PROCEED:
      static_cast<EnsOffchainLookupInterstitialControllerClient*>(controller())
          ->DontProceed();
      break;
    case security_interstitials::CMD_PROCEED:
      controller()->Proceed();
      break;
    default:
      NOTREACHED_IN_MIGRATION() << "Unsupported command: " << command;
  }
}

void EnsOffchainLookupOptInPage::PopulateInterstitialStrings(
    base::Value::Dict& load_time_data) {
  const std::vector<std::u16string> message_params = {
      u"<a "
      u"href='https://github.com/brave/brave-browser/wiki/ENS-offchain-lookup'"
      u"target='_blank' rel='noopener noreferrer'>",

      u"</a>",
  };

  load_time_data.Set("tabTitle", brave_l10n::GetLocalizedResourceUTF16String(
                                     IDS_ENS_OFFCHAIN_LOOKUP_OPT_IN_TITLE));
  load_time_data.Set("heading", brave_l10n::GetLocalizedResourceUTF16String(
                                    IDS_ENS_OFFCHAIN_LOOKUP_OPT_IN_HEADING));
  load_time_data.Set("primaryParagraph",
                     base::ReplaceStringPlaceholders(
                         brave_l10n::GetLocalizedResourceUTF16String(
                             IDS_ENS_OFFCHAIN_LOOKUP_OPT_IN_PRIMARY_PARAGRAPH),
                         message_params, nullptr));

  load_time_data.Set("primaryButtonText",
                     brave_l10n::GetLocalizedResourceUTF16String(
                         IDS_ENS_OFFCHAIN_LOOKUP_OPT_IN_PROCEED));
  load_time_data.Set("dontProceedButtonText",
                     brave_l10n::GetLocalizedResourceUTF16String(
                         IDS_ENS_OFFCHAIN_LOOKUP_OPT_IN_DONT_PROCEED));
  load_time_data.Set("finalParagraph", std::u16string());
}

int EnsOffchainLookupOptInPage::GetHTMLTemplateId() {
  return IDR_DECENTRALIZED_DNS_INTERSTITIAL_HTML;
}

security_interstitials::SecurityInterstitialPage::TypeID
EnsOffchainLookupOptInPage::GetTypeForTesting() {
  return EnsOffchainLookupOptInPage::kTypeForTesting;
}

}  // namespace decentralized_dns
