#include "src/chrome/browser/extensions/api/safe_browsing_private/safe_browsing_private_event_router.cc"


namespace enterprise_connectors {


// static
RealtimeReportingClient* RealtimeReportingClientFactory::GetForProfile(
    content::BrowserContext* context) {
  return nullptr;
}



// static
RealtimeReportingClientFactory* RealtimeReportingClientFactory::GetInstance() {
  static base::NoDestructor<RealtimeReportingClientFactory> instance;
  return instance.get();
}

RealtimeReportingClientFactory::RealtimeReportingClientFactory()
    : ProfileKeyedServiceFactory(
          "RealtimeReportingClient",
          ProfileSelections::Builder()
              .WithRegular(ProfileSelection::kOwnInstance)
              // Guest Profile follows Regular Profile selection mode.
              .WithGuest(ProfileSelection::kOwnInstance)
              .WithSystem(ProfileSelection::kNone)
              // TODO(crbug.com/41488885): Check if this service is needed for
              // Ash Internals.
              .WithAshInternals(ProfileSelection::kOwnInstance)
              .Build()) {
  DependsOn(IdentityManagerFactory::GetInstance());
  DependsOn(ConnectorsServiceFactory::GetInstance());
}

RealtimeReportingClientFactory::~RealtimeReportingClientFactory() = default;

KeyedService* RealtimeReportingClientFactory::BuildServiceInstanceFor(
    content::BrowserContext* context) const {
  return nullptr;
}

bool RealtimeReportingClientFactory::ServiceIsCreatedWithBrowserContext()
    const {
  return false;
}

bool RealtimeReportingClientFactory::ServiceIsNULLWhileTesting() const {
  return true;
}

}
