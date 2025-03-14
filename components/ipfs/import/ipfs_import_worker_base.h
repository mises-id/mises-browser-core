/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_COMPONENTS_IPFS_IMPORT_IPFS_IMPORT_WORKER_BASE_H_
#define BRAVE_COMPONENTS_IPFS_IMPORT_IPFS_IMPORT_WORKER_BASE_H_

#include <list>
#include <memory>
#include <string>
#include <utility>
#include <vector>

#include "base/functional/callback.h"
#include "base/containers/queue.h"
#include "base/files/file_util.h"
#include "base/memory/raw_ptr.h"
#include "base/memory/scoped_refptr.h"
#include "mises/components/api_request_helper/api_request_helper.h"
#include "mises/components/ipfs/blob_context_getter_factory.h"
#include "mises/components/ipfs/import/imported_data.h"
#include "mises/components/ipfs/ipfs_network_utils.h"
#include "components/version_info/channel.h"
#include "services/network/public/cpp/shared_url_loader_factory.h"
#include "url/gurl.h"

namespace network {
class SharedURLLoaderFactory;
struct ResourceRequest;
}  // namespace network

namespace ipfs {

// A base class that implements steps for importing objects into ipfs.
// In order to import an object it is necessary to create
// an ImportWorker of the desired type, each worker can import only one object.
// The worker must be deleted when the import is completed.
// The import process consists of the following steps:
// Worker:
//   1. Worker prepares a blob block of data to import
// IpfsImportWorkerBase:
//   2. Sends blob to ifps using IPFS api (/api/v0/add)
//   3. Creates target directory for import using IPFS api(/api/v0/files/mkdir)
//   4. Moves objects to target directory using IPFS api(/api/v0/files/cp)
//   5. Publishes objects under passed IPNS key(/api/v0/name/publish)
class IpfsImportWorkerBase {
 public:
  IpfsImportWorkerBase(
      BlobContextGetterFactory* blob_context_getter_factory,
      scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory,
      const GURL& endpoint,
      ImportCompletedCallback callback,
      const std::string& key = std::string());
  virtual ~IpfsImportWorkerBase();

  IpfsImportWorkerBase(const IpfsImportWorkerBase&) = delete;
  IpfsImportWorkerBase& operator=(const IpfsImportWorkerBase&) = delete;

  void ImportFile(const base::FilePath upload_file_path);
  void ImportFile(const base::FilePath upload_file_path,
                  const std::string& mime_type,
                  const std::string& filename);
  void ImportText(const std::string& text, const std::string& host);
  void ImportFolder(const base::FilePath folder_path);

 protected:
  scoped_refptr<network::SharedURLLoaderFactory> GetUrlLoaderFactory();

  virtual void NotifyImportCompleted(ipfs::ImportState state);

 private:
  void UploadData(std::unique_ptr<network::ResourceRequest> request);

  void OnImportAddComplete(std::unique_ptr<std::string> response_body);

  void CreateBraveDirectory();
  void OnImportDirectoryCreated(const std::string& directory,
                                api_request_helper::APIRequestResult response);
  void CopyFilesToBraveDirectory();
  void OnImportFilesMoved(api_request_helper::APIRequestResult response);
  bool ParseResponseBody(const std::string& response_body,
                         ipfs::ImportedData* data);
  void PublishContent();
  void OnContentPublished(api_request_helper::APIRequestResult response);

  ImportCompletedCallback callback_;
  std::unique_ptr<ipfs::ImportedData> data_;

  raw_ptr<BlobContextGetterFactory> blob_context_getter_factory_ = nullptr;
  scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory_;
  std::unique_ptr<api_request_helper::APIRequestHelper> url_loader_;
  std::unique_ptr<network::SimpleURLLoader> simple_url_loader_;
  GURL server_endpoint_;
  std::string key_to_publish_;
  base::WeakPtrFactory<IpfsImportWorkerBase> weak_factory_;
};

}  // namespace ipfs

#endif  // BRAVE_COMPONENTS_IPFS_IMPORT_IPFS_IMPORT_WORKER_BASE_H_
