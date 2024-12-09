#include "src/chrome/browser/extensions/api/safe_browsing_private/safe_browsing_private_event_router.cc"


namespace enterprise_connectors {


RealtimeReportingClient::RealtimeReportingClient(
    content::BrowserContext* context)
    :context_(context) {

}
RealtimeReportingClient::~RealtimeReportingClient() = default;

void RealtimeReportingClient::OnClientError(policy::CloudPolicyClient* client) {
}

std::optional<ReportingSettings>
RealtimeReportingClient::GetReportingSettings() {
  return std::nullopt;
}
std::string RealtimeReportingClient::GetProfileUserName() const{
  return "dummy";
}
void RealtimeReportingClient::ReportRealtimeEvent(
    const std::string& name,
    const ReportingSettings& settings,
    base::Value::Dict event) {
}

void RealtimeReportingClient::ReportPastEvent(const std::string& name,
                                              const ReportingSettings& settings,
                                              base::Value::Dict event,
                                              const base::Time& time) {
}

// static
RealtimeReportingClient* RealtimeReportingClientFactory::GetForProfile(
    content::BrowserContext* context) {
    return static_cast<RealtimeReportingClient*>(
      GetInstance()->GetServiceForBrowserContext(context, true));
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
  return new RealtimeReportingClient(context);
}

bool RealtimeReportingClientFactory::ServiceIsCreatedWithBrowserContext()
    const {
  return false;
}

bool RealtimeReportingClientFactory::ServiceIsNULLWhileTesting() const {
  return true;
}

}
