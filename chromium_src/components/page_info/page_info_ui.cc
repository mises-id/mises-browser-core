/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "components/page_info/page_info_ui.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "chrome/common/url_constants.h"

#if BUILDFLAG(ENABLE_IPFS)
#include "mises/components/ipfs/ipfs_utils.h"
#include "components/grit/mises_components_strings.h"
#include "mises/browser/net/decentralized_dns_network_delegate_helper.h"
#endif  // BUILDFLAG(ENABLE_IPFS)

#if BUILDFLAG(ENABLE_IPFS)
#define GetSecurityDescription GetSecurityDescription_ChromiumImpl
#endif  // BUILDFLAG(ENABLE_IPFS)

#include "src/components/page_info/page_info_ui.cc"

#if BUILDFLAG(ENABLE_IPFS)
#undef GetSecurityDescription

std::unique_ptr<PageInfoUI::SecurityDescription>
PageInfoUI::GetSecurityDescription(const IdentityInfo& identity_info) const {
  GURL url = GURL(identity_info.site_identity);
  if (!url.is_valid()) {
    url = GURL("http://" + identity_info.site_identity);
  }
  if (ipfs::IsIPFSScheme(url)  || decentralized_dns::ShouldHandleUrl(url))
    return CreateSecurityDescription(
      SecuritySummaryColor::GREEN, IDS_PAGE_INFO_IPFS_BUBBLE_TITTLE,
      IDS_PAGE_INFO_IPFS_BUBBLE_TEXT, SecurityDescriptionType::CONNECTION);
  
  if (url.SchemeIs(chrome::kChromeSearchScheme)) 
    return CreateSecurityDescription(
      SecuritySummaryColor::GREEN, 0, IDS_PAGE_INFO_INTERNAL_PAGE,
                                       SecurityDescriptionType::INTERNAL);
  return GetSecurityDescription_ChromiumImpl(identity_info);
}
#endif  // BUILDFLAG(ENABLE_IPFS)
