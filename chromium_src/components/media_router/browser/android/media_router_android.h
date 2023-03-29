#ifndef MISES_COMPONENTS_MEDIA_ROUTER_BROWSER_ANDROID_MEDIA_ROUTER_ANDROID_H_
#define MISES_COMPONENTS_MEDIA_ROUTER_BROWSER_ANDROID_MEDIA_ROUTER_ANDROID_H_


#include "base/containers/id_map.h"
#include "base/memory/raw_ptr.h"
#include "base/observer_list.h"
#include "components/media_router/browser/android/media_router_android_bridge.h"
#include "components/media_router/browser/media_router_base.h"
#include "mojo/public/cpp/bindings/pending_remote.h"
#include "mojo/public/cpp/bindings/receiver.h"
#include "mojo/public/cpp/bindings/remote.h"

#include "components/media_router/browser/issue_manager.h"
#include "components/media_router/browser/logger_impl.h"

#define Initialize \
  GetMediaController(\
      const MediaRoute::Id& route_id,\
      mojo::PendingReceiver<mojom::MediaController> controller,\
      mojo::PendingRemote<mojom::MediaStatusObserver> observer) override;\
  IssueManager* GetIssueManager() override;\
  base::Value GetLogs() const override;\
  base::Value::Dict GetState() const override;\
  void GetProviderState(\
      mojom::MediaRouteProviderId provider_id,\
      mojom::MediaRouteProvider::GetStateCallback callback) const override;\
  LoggerImpl* GetLogger() override;\
  IssueManager issue_manange_;\
  LoggerImpl logger_;\
  void Initialize

#include "src/components/media_router/browser/android/media_router_android.h"
#undef Initialize

#endif  // COMPONENTS_MEDIA_ROUTER_BROWSER_ANDROID_MEDIA_ROUTER_ANDROID_H_
