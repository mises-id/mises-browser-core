
/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/ui/toolbar/mises_location_bar_model_delegate.h"

#include "base/strings/utf_string_conversions.h"
#include "mises/components/constants/url_constants.h"
#include "mises/components/constants/webui_url_constants.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "mises/components/ipfs/ipfs_constants.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/ui/browser.h"
#include "extensions/buildflags/buildflags.h"


#include "mises/components/ipfs/buildflags/buildflags.h"
#if BUILDFLAG(ENABLE_IPFS)
#include "mises/components/ipfs/ipfs_constants.h"
#endif

MisesLocationBarModelDelegate::MisesLocationBarModelDelegate(Browser* browser)
    : BrowserLocationBarModelDelegate(browser) {}

MisesLocationBarModelDelegate::~MisesLocationBarModelDelegate() = default;

// static
void MisesLocationBarModelDelegate::FormattedStringFromURL(
    const GURL& url,
    std::u16string* new_formatted_url) {
  if (url.SchemeIs("chrome")) {
    base::ReplaceFirstSubstringAfterOffset(new_formatted_url, 0, u"chrome://",
                                           u"mises://");
  }
#if BUILDFLAG(ENABLE_IPFS)
  if ((url.SchemeIs(ipfs::kIPFSScheme) || url.SchemeIs(ipfs::kIPNSScheme))) {
  }
#endif


}

std::u16string
MisesLocationBarModelDelegate::FormattedStringWithEquivalentMeaning(
    const GURL& url,
    const std::u16string& formatted_url) const {
  std::u16string new_formatted_url =
      BrowserLocationBarModelDelegate::FormattedStringWithEquivalentMeaning(
          url, formatted_url);
  MisesLocationBarModelDelegate::FormattedStringFromURL(url,
                                                        &new_formatted_url);
  return new_formatted_url;
}
