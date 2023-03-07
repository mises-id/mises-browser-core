#include <memory>
#include <string>
#include <utility>

#include "base/json/json_reader.h"
#include "base/json/json_writer.h"
#include "base/threading/thread_task_runner_handle.h"
#include "base/values.h"
#include "content/public/browser/browser_context.h"
#include "third_party/abseil-cpp/absl/types/optional.h"

#include "chrome/browser/extensions/api/messaging/native_message_built_in_host.h"
#include "content/public/browser/browser_context.h"
#include "content/public/browser/browser_task_traits.h"
#include "content/public/browser/browser_thread.h"
#include "extensions/browser/api/messaging/native_message_host.h"


namespace extensions {

namespace {


class NativeMessageMisesHost : public NativeMessageHost {
 public:
  static const char* const kHostName;
  static const char* const kOrigins[];
  static const size_t kOriginCount;

  static std::unique_ptr<NativeMessageHost> Create(
      content::BrowserContext* browser_context);

  NativeMessageMisesHost();
  NativeMessageMisesHost(const NativeMessageMisesHost&) = delete;
  NativeMessageMisesHost& operator=(const NativeMessageMisesHost&) = delete;
  ~NativeMessageMisesHost() override;

  // NativeMessageHost implementation.
  void Start(Client* client) override;
  void OnMessage(const std::string& request_string) override;
  scoped_refptr<base::SingleThreadTaskRunner> task_runner() const override;

 private:
  void ProcessEcho(const base::Value::Dict& request);

  // Counter used to ensure message uniqueness for testing.
  int message_number_ = 0;

  // |client_| must outlive this test instance.
  raw_ptr<Client> client_ = nullptr;
};


// static
// Must match ScopedTestNativeMessagingHost::kHostName.
const char* const NativeMessageMisesHost::kHostName =
    "site.mises.browser";

// static
// Must match ScopedTestNativeMessagingHost::kExtensionId.
const char* const NativeMessageMisesHost::kOrigins[] = {
    "chrome-extension://jkpbgdgopmifmokhejofbmgdabapoefl/"};

// static
const size_t NativeMessageMisesHost::kOriginCount = std::size(kOrigins);

// static
std::unique_ptr<NativeMessageHost> NativeMessageMisesHost::Create(
    content::BrowserContext* browser_context) {
  return std::make_unique<NativeMessageMisesHost>();
}

NativeMessageMisesHost::NativeMessageMisesHost() = default;
NativeMessageMisesHost::~NativeMessageMisesHost() = default;

void NativeMessageMisesHost::Start(Client* client) {
  client_ = client;
}

void NativeMessageMisesHost::OnMessage(const std::string& request_string) {
  absl::optional<base::Value> request_value =
      base::JSONReader::Read(request_string);
  if (!request_value.has_value()) {
    client_->CloseChannel(kHostInputOutputError);
  } else if (request_string.find("stopHostTest") != std::string::npos) {
    client_->CloseChannel(kNativeHostExited);
  } else if (request_string.find("bigMessageTest") != std::string::npos) {
    client_->CloseChannel(kHostInputOutputError);
  } else {
    ProcessEcho(request_value->GetDict());
  }
}

scoped_refptr<base::SingleThreadTaskRunner> NativeMessageMisesHost::task_runner()
    const {
  return base::ThreadTaskRunnerHandle::Get();
}

void NativeMessageMisesHost::ProcessEcho(const base::Value::Dict& request) {
  base::Value::Dict response;
  response.Set("id", ++message_number_);
  response.Set("echo", request.Clone());
  response.Set("caller_url", kOrigins[0]);
  std::string response_string;
  base::JSONWriter::Write(response, &response_string);
  client_->PostMessageFromNativeHost(response_string);
}


}  // namespace

const NativeMessageBuiltInHost kBuiltInHosts[] = {
    {NativeMessageMisesHost::kHostName, NativeMessageMisesHost::kOrigins,
     NativeMessageMisesHost::kOriginCount, &NativeMessageMisesHost::Create},
};

const size_t kBuiltInHostsCount = std::size(kBuiltInHosts);

}  // namespace extensions