#include "src/components/media_router/browser/android/media_router_android.cc"

namespace media_router {

IssueManager* MediaRouterAndroid::GetIssueManager() {
  return &issue_manange_;
}

void MediaRouterAndroid::GetMediaController(
      const MediaRoute::Id& route_id,
      mojo::PendingReceiver<mojom::MediaController> controller,
      mojo::PendingRemote<mojom::MediaStatusObserver> observer)
{
}
base::Value MediaRouterAndroid::GetState() const {
  return base::Value(base::Value::Type::DICTIONARY);
}
base::Value MediaRouterAndroid::GetLogs() const {
  return base::Value(base::Value::Type::DICTIONARY);
}
LoggerImpl* MediaRouterAndroid::GetLogger(){
  return &logger_;
}
void MediaRouterAndroid::GetProviderState(
    mojom::MediaRouteProviderId provider_id,
    mojom::MediaRouteProvider::GetStateCallback callback) const {
    std::move(callback).Run(mojom::ProviderStatePtr());
}
}  // namespace media_router
