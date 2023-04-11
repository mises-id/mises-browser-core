#include "src/components/media_router/browser/test/mock_media_router.cc"


namespace media_router {

IssueManager* MockMediaRouter::GetIssueManager() {
  return &issue_manange_;
}

void MockMediaRouter::GetMediaController(
      const MediaRoute::Id& route_id,
      mojo::PendingReceiver<mojom::MediaController> controller,
      mojo::PendingRemote<mojom::MediaStatusObserver> observer)
{
}
base::Value::Dict MockMediaRouter::GetState() const {
  return base::Value::Dict();
}
base::Value MockMediaRouter::GetLogs() const {
  return base::Value(base::Value::Type::DICTIONARY);
}
LoggerImpl* MockMediaRouter::GetLogger(){
  return &logger_;
}
void MockMediaRouter::GetProviderState(
    mojom::MediaRouteProviderId provider_id,
    mojom::MediaRouteProvider::GetStateCallback callback) const {
    std::move(callback).Run(mojom::ProviderStatePtr());
}
}  // namespace media_router