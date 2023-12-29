#ifndef MISES_COMPONENTS_MEDIA_ROUTER_BROWSER_ANDROID_MEDIA_ROUTER_ANDROID_H_
#define MISES_COMPONENTS_MEDIA_ROUTER_BROWSER_ANDROID_MEDIA_ROUTER_ANDROID_H_


#include "base/containers/id_map.h"
#include "base/memory/raw_ptr.h"
#include "base/observer_list.h"
#include "components/media_router/browser/android/media_router_android_bridge.h"
#include "components/media_router/browser/media_router_base.h"
#include "components/media_router/browser/media_router_debugger.h"
#include "mojo/public/cpp/bindings/pending_remote.h"
#include "mojo/public/cpp/bindings/receiver.h"
#include "mojo/public/cpp/bindings/remote.h"

#include "components/media_router/browser/issue_manager.h"
#include "components/media_router/browser/logger_impl.h"
#include "chrome/browser/media/router/mojo/media_router_debugger_impl.h"


namespace media_router {

// An implementation for media router debugging and feedback.
class MediaRouterDebuggerDummy : public MediaRouterDebugger {
 public:

  explicit MediaRouterDebuggerDummy();

  MediaRouterDebuggerDummy(const MediaRouterDebuggerDummy&) = delete;
  MediaRouterDebuggerDummy& operator=(const MediaRouterDebuggerDummy&) = delete;

  ~MediaRouterDebuggerDummy() override;

  // MediaRouterDebugger implementation:
  base::Value::Dict GetMirroringStats() final;
  void AddObserver(MirroringStatsObserver& obs) final {}
  void RemoveObserver(MirroringStatsObserver& obs) final {}
  void EnableRtcpReports() final {}
  void DisableRtcpReports() final {}
  bool ShouldFetchMirroringStats() const final;


 protected:
  base::WeakPtrFactory<MediaRouterDebuggerDummy> weak_ptr_factory_{this};
};

}  // namespace media_router

#define Initialize \
  GetMediaController(\
      const MediaRoute::Id& route_id,\
      mojo::PendingReceiver<mojom::MediaController> controller,\
      mojo::PendingRemote<mojom::MediaStatusObserver> observer) override;\
  MirroringMediaControllerHost* GetMirroringMediaControllerHost(\
      const MediaRoute::Id& route_id) override;\
  IssueManager* GetIssueManager() override;\
  base::Value GetLogs() const override;\
  base::Value::Dict GetState() const override;\
  void GetProviderState(\
      mojom::MediaRouteProviderId provider_id,\
      mojom::MediaRouteProvider::GetStateCallback callback) const override;\
  LoggerImpl* GetLogger() override;\
  MediaRouterDebugger& GetDebugger() override;\
  IssueManager issue_manange_;\
  LoggerImpl logger_;\
  media_router::MediaRouterDebuggerDummy media_router_debugger_;\
  void Initialize

#include "src/components/media_router/browser/android/media_router_android.h"
#undef Initialize

#endif  // COMPONENTS_MEDIA_ROUTER_BROWSER_ANDROID_MEDIA_ROUTER_ANDROID_H_
