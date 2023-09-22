/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/brave_wallet/blockchain_images_source.h"

#include <utility>


#include "base/files/file_path.h"
#include "base/files/file_util.h"
#include "base/functional/bind.h"
#include "base/memory/ref_counted_memory.h"
#include "base/task/thread_pool.h"
#include "mises/components/brave_wallet/browser/brave_wallet_constants.h"
#include "mises/components/brave_wallet/browser/wallet_data_files_installer.h"
#include "content/public/browser/browser_task_traits.h"
#include "content/public/browser/browser_thread.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/image_fetcher/image_fetcher_service_factory.h"
#include "components/image_fetcher/core/image_fetcher.h"
#include "components/image_fetcher/core/request_metadata.h"
#include "components/image_fetcher/core/image_fetcher_service.h"
#include "net/traffic_annotation/network_traffic_annotation.h"
#include "chrome/browser/profiles/profile_key.h"
#include "ui/gfx/gfx_export.h"
#include "ui/gfx/canvas.h"
#include "ui/gfx/geometry/rect_f.h"
#include "ui/gfx/image/image.h"
#include "ui/gfx/image/image_skia.h"
#include "ui/gfx/image/image_skia_operations.h"
#include "ui/gfx/codec/png_codec.h"

namespace brave_wallet {

namespace {

constexpr char kUmaClientName[] = "BraveWalletImageFetcher";

constexpr net::NetworkTrafficAnnotationTag kBraveWalletImageTrafficAnnotation =
    net::DefineNetworkTrafficAnnotation("brave_wallet_image_fetcher_token_image",
                                        R"(
      semantics {
        sender: "Brave Wallet Image Fetcher"
        description:
          "Fetches customized card art images for credit cards stored in "
          "Chrome. Images are hosted on Google static content server, "
          "the data source may come from third parties (credit card issuers)."
        trigger: "When new credit card data is sent to Chrome if the card "
          "has a related card art image, and when the credit card data in "
          "the web database is refreshed and any card art image is missing."
        user_data {
          type: NONE
        }
        data: "URL of the image to be fetched."
        destination: GOOGLE_OWNED_SERVICE
        internal {
          contacts {
            email: "chrome-payments-team@google.com"
          }
        }
        last_reviewed: "2023-05-12"
      }
      policy {
        cookies_allowed: NO
        setting:
          "Users can enable or disable this feature in Chromium settings by "
          "toggling 'Credit cards and addresses using Google Payments', "
          "under 'Advanced sync settings...'."
        chrome_policy {
          AutoFillEnabled {
            policy_options {mode: MANDATORY}
            AutoFillEnabled: false
          }
        }
      })");

}  // namespace

BlockchainImagesSource::BlockchainImagesSource(ProfileKey* key)
    : key_(key), weak_factory_(this) {
}

BlockchainImagesSource::~BlockchainImagesSource() = default;

std::string BlockchainImagesSource::GetSource() {
  return kImageSourceHost;
}



image_fetcher::ImageFetcher* BlockchainImagesSource::GetImageFetcher() {
  InitializeImageFetcher();
  return image_fetcher_;
}


void BlockchainImagesSource::InitializeImageFetcher() {
  if (image_fetcher_) {
    return;
  }

  // Lazily initialize the `image_fetcher_`, since
  // ImageFetcherServiceFactory relies on the initialization of the profile, and
  // when AutofillImageFetcher is created, the initialization of the profile is
  // not done yet.
  image_fetcher::ImageFetcherService* image_fetcher_service =
      ImageFetcherServiceFactory::GetForKey(key_);
  if (!image_fetcher_service) {
    return;
  }

  // TODO(crbug.com/1382289): Fix and change the config back to kDiskCacheOnly.
  image_fetcher_ = image_fetcher_service->GetImageFetcher(
      image_fetcher::ImageFetcherConfig::kDiskCacheOnly);
}

void BlockchainImagesSource::StartDataRequest(
    const GURL& url,
    const content::WebContents::Getter& wc_getter,
    GotDataCallback callback) {
  DCHECK_CURRENTLY_ON(content::BrowserThread::UI);

  const std::string path = URLDataSource::URLToRequestPath(url);

  GURL resolved_url = GURL("https://cdn.mises.site/s3://mises-storage/resources/token-icons/" + path);
  LOG(INFO) << "BlockchainImagesSource::StartDataRequest:" << resolved_url;
  auto *image_fetcher = GetImageFetcher();
  if (image_fetcher) {
    image_fetcher::ImageFetcherParams params(
      kBraveWalletImageTrafficAnnotation, kUmaClientName);
    image_fetcher->FetchImage(
      resolved_url,
      base::BindOnce(&BlockchainImagesSource::OnTokenImageFetched, weak_factory_.GetWeakPtr(),
                     std::move(callback)),
      std::move(params));
  }
  

}


void BlockchainImagesSource::OnTokenImageFetched(
    GotDataCallback callback,
    const gfx::Image& token_image,
    const image_fetcher::RequestMetadata& metadata) {
    
  absl::optional<std::string> input;
  if (!token_image.IsEmpty() && token_image.ToSkBitmap()) {
    std::vector<unsigned char> output;
    gfx::PNGCodec::EncodeBGRASkBitmap(*token_image.ToSkBitmap(), false, &output);
    input = std::string(output.begin(), output.end());
  }
  
  scoped_refptr<base::RefCountedMemory> bytes;
  if (!input) {
    LOG(INFO) << "BlockchainImagesSource::OnTokenImageFetched fail";
    std::move(callback).Run(std::move(bytes));
    return;
  }

  LOG(INFO) << "BlockchainImagesSource::OnTokenImageFetched success";
  bytes = new base::RefCountedBytes(
      reinterpret_cast<const unsigned char*>(input->c_str()), input->length());
  std::move(callback).Run(std::move(bytes));
}


std::string BlockchainImagesSource::GetMimeType(const GURL& url) {
  const std::string path = URLDataSource::URLToRequestPath(url);
  if (base::EndsWith(path, ".png", base::CompareCase::INSENSITIVE_ASCII))
    return "image/png";
  if (base::EndsWith(path, ".gif", base::CompareCase::INSENSITIVE_ASCII))
    return "image/gif";
  if (base::EndsWith(path, ".jpg", base::CompareCase::INSENSITIVE_ASCII))
    return "image/jpg";
  return "image/svg+xml";
}

bool BlockchainImagesSource::AllowCaching() {
  return true;
}

}  // namespace brave_wallet
