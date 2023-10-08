/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_BROWSER_BRAVE_WALLET_BLOCKCHAIN_IMAGES_SOURCE_H_
#define BRAVE_BROWSER_BRAVE_WALLET_BLOCKCHAIN_IMAGES_SOURCE_H_

#include <string>

#include "base/memory/weak_ptr.h"
#include "content/public/browser/url_data_source.h"
#include "third_party/abseil-cpp/absl/types/optional.h"
#include "base/memory/weak_ptr.h"
#include "base/time/time.h"
#include "third_party/abseil-cpp/absl/types/optional.h"

class ProfileKey;
class GURL;

namespace gfx {
class Image;
}  // namespace gfx

namespace image_fetcher {
class ImageFetcher;
struct RequestMetadata;
}  // namespace image_fetcher

namespace brave_wallet {

// This serves background image data.
class BlockchainImagesSource : public content::URLDataSource {
 public:
  explicit BlockchainImagesSource(ProfileKey* key);

  ~BlockchainImagesSource() override;

  BlockchainImagesSource(const BlockchainImagesSource&) = delete;
  BlockchainImagesSource& operator=(const BlockchainImagesSource&) = delete;
  std::string getImagePath();

 private:
  FRIEND_TEST_ALL_PREFIXES(BlockchainImagesSourceTest, GetMimeType);
  friend class BlockchainImagesSourceTest;

  // content::URLDataSource overrides:
  std::string GetSource() override;
  void StartDataRequest(const GURL& url,
                        const content::WebContents::Getter& wc_getter,
                        GotDataCallback callback) override;
  std::string GetMimeType(const GURL& url) override;
  bool AllowCaching() override;
  void OnTokenImageFetched(
    GotDataCallback callback,
    const gfx::Image& token_image,
    const image_fetcher::RequestMetadata& metadata);

  image_fetcher::ImageFetcher* GetImageFetcher();
  void InitializeImageFetcher();
  raw_ptr<image_fetcher::ImageFetcher> image_fetcher_ = nullptr;
  raw_ptr<ProfileKey> key_;
  base::WeakPtrFactory<BlockchainImagesSource> weak_factory_;
};

}  // namespace brave_wallet

#endif  // BRAVE_BROWSER_BRAVE_WALLET_BLOCKCHAIN_IMAGES_SOURCE_H_
