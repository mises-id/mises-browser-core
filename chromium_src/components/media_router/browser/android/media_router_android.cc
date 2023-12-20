#include "src/components/media_router/browser/android/media_router_android.cc"

namespace media_router {

MediaRouterDebuggerDummy::MediaRouterDebuggerDummy() = default;
MediaRouterDebuggerDummy::~MediaRouterDebuggerDummy() = default;
base::Value::Dict MediaRouterDebuggerDummy::GetMirroringStats() {
  return base::Value::Dict();
}

bool MediaRouterDebuggerDummy::ShouldFetchMirroringStats() const {
  return false;
}

MirroringMediaControllerHost* GetMirroringMediaControllerHost(
    const MediaRoute::Id& route_id) {
  return nullptr;
}
IssueManager* MediaRouterAndroid::GetIssueManager() {
  return &issue_manange_;
}

void MediaRouterAndroid::GetMediaController(
      const MediaRoute::Id& route_id,
      mojo::PendingReceiver<mojom::MediaController> controller,
      mojo::PendingRemote<mojom::MediaStatusObserver> observer)
{
}
base::Value::Dict MediaRouterAndroid::GetState() const {
  return base::Value::Dict();
}
base::Value MediaRouterAndroid::GetLogs() const {
  return base::Value(base::Value::Type::DICT);
}
LoggerImpl* MediaRouterAndroid::GetLogger(){
  return &logger_;
}
void MediaRouterAndroid::GetProviderState(
    mojom::MediaRouteProviderId provider_id,
    mojom::MediaRouteProvider::GetStateCallback callback) const {
    std::move(callback).Run(mojom::ProviderStatePtr());
}
MediaRouterDebugger& MediaRouterAndroid::GetDebugger() {
  return media_router_debugger_;
}
}  // namespace media_router
