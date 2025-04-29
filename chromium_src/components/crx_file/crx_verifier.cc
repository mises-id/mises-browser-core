#include "build/build_config.h"
#include "components/crx_file/crx_verifier.h"

// #include <iostream>
// #include <vector>
// #include <sstream>
// #include <iomanip>

#include "base/logging.h"

#if BUILDFLAG(IS_ANDROID)
#include "base/android/content_uri_utils.h"
#define MISES_CRX_CONTENT_URL_HANDLER \
  base::File file; \
  if (crx_path.IsContentUri()) { \
    file = base::OpenContentUri(crx_path, base::File::FLAG_OPEN | base::File::FLAG_READ); \
  } else { \
    file = base::File(crx_path, base::File::FLAG_OPEN | base::File::FLAG_READ); \
  }

#else

#define MISES_CRX_CONTENT_URL_HANDLER base::File file(crx_path, base::File::FLAG_OPEN | base::File::FLAG_READ);

#endif 


namespace {

  // The Brave publisher key that is accepted in addition to upstream's
  // kPublisherKeyHash. This key may be used to verify updates of the browser
  // itself. If you change this constant, then you will likely also need to change
  // the associated file crx-private-key.der, which is not in Git.
  constexpr uint8_t kBravePublisherKeyHash[] = {
      0x93, 0x74, 0xd6, 0x2a, 0x32, 0x76, 0x74, 0x74, 0xac, 0x99, 0xd9,
      0xc0, 0x55, 0xea, 0xf2, 0x6e, 0x10, 0x7,  0x45, 0x6,  0xb9, 0xd5,
      0x35, 0xc8, 0x35, 0x8,  0x28, 0x97, 0x5f, 0x7a, 0xc1, 0x97};
  
  constexpr uint8_t kEdgePublisherKeyHash[] = {
    0x67, 0x5b, 0xd8, 0xed, 0xdd, 0x38, 0x50, 0x20, 0x17, 0x7c, 
    0xcf, 0xed, 0xa2, 0x51, 0x03, 0x89, 0x57, 0x99, 0xfe, 0x41, 
    0xec, 0xa5, 0xc9, 0x4e, 0x61, 0xdc, 0x13, 0xdf, 0x35, 0x9d, 0xa1, 0xdc};
    
  // std::string toHexString(const std::vector<uint8_t>& data) {
  //     std::ostringstream oss;
  //     for (size_t i = 0; i < data.size(); ++i) {
  //         oss << "0x" << std::hex << std::setw(2) << std::setfill('0')
  //             << static_cast<int>(data[i]);
  //         if (i != data.size() - 1) {
  //             oss << ", ";
  //         }
  //     }
  //     return oss.str();
  // }
  // Used in the patch in crx_verifier.cc.
  bool IsMisesSupportedPublisher(const std::vector<uint8_t>& key_hash) {
    std::vector<uint8_t> publisher_key_brave(std::begin(kBravePublisherKeyHash), std::end(kBravePublisherKeyHash));
    std::vector<uint8_t> publisher_key_edge(std::begin(kEdgePublisherKeyHash), std::end(kEdgePublisherKeyHash));
    bool ret =  publisher_key_brave == key_hash || publisher_key_edge == key_hash;
    // if (!ret) {
    //   LOG(INFO) << "IsMisesSupportedPublisher:" << toHexString(key_hash);
    // }
    return ret;
  }
  
  }  // namespace


#include "src/components/crx_file/crx_verifier.cc"
#undef MISES_CRX_CONTENT_URL_HANDLER

