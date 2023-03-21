
#include "src/content/public/browser/authenticator_request_client_delegate.cc"
namespace content{

#if BUILDFLAG(IS_ANDROID)
absl::optional<std::string>
WebAuthenticationDelegate::MaybeGetRelyingPartyIdOverride(
    const std::string& claimed_relying_party_id,
    const url::Origin& caller_origin) {
  return absl::nullopt;
}

bool WebAuthenticationDelegate::ShouldPermitIndividualAttestation(
    BrowserContext* browser_context,
    const url::Origin& caller_origin,
    const std::string& relying_party_id) {
  return false;
}

bool WebAuthenticationDelegate::SupportsResidentKeys(
    RenderFrameHost* render_frame_host) {
  // The testing API supports resident keys, but for real requests //content
  // doesn't by default.
  FrameTreeNode* frame_tree_node =
      static_cast<RenderFrameHostImpl*>(render_frame_host)->frame_tree_node();
  if (AuthenticatorEnvironmentImpl::GetInstance()
          ->IsVirtualAuthenticatorEnabledFor(frame_tree_node)) {
    return true;
  }
  return false;
}

bool WebAuthenticationDelegate::IsFocused(WebContents* web_contents) {
  return true;
}

absl::optional<bool> WebAuthenticationDelegate::
    IsUserVerifyingPlatformAuthenticatorAvailableOverride(
        RenderFrameHost* render_frame_host) {
  FrameTreeNode* frame_tree_node =
      static_cast<RenderFrameHostImpl*>(render_frame_host)->frame_tree_node();
  if (AuthenticatorEnvironmentImpl::GetInstance()
          ->IsVirtualAuthenticatorEnabledFor(frame_tree_node)) {
    return AuthenticatorEnvironmentImpl::GetInstance()
        ->HasVirtualUserVerifyingPlatformAuthenticator(frame_tree_node);
  }
  return absl::nullopt;
}

WebAuthenticationRequestProxy* WebAuthenticationDelegate::MaybeGetRequestProxy(
    BrowserContext* browser_context,const url::Origin& caller_origin) {
  return nullptr;
}



AuthenticatorRequestClientDelegate::AuthenticatorRequestClientDelegate() =
    default;

AuthenticatorRequestClientDelegate::~AuthenticatorRequestClientDelegate() =
    default;

void AuthenticatorRequestClientDelegate::SetRelyingPartyId(const std::string&) {
}

bool AuthenticatorRequestClientDelegate::DoesBlockRequestOnFailure(
    InterestingFailureReason reason) {
  return false;
}

void AuthenticatorRequestClientDelegate::RegisterActionCallbacks(
    base::OnceClosure cancel_callback,
    base::RepeatingClosure start_over_callback,
    AccountPreselectedCallback account_preselected_callback,
    device::FidoRequestHandlerBase::RequestCallback request_callback,
    base::RepeatingClosure bluetooth_adapter_power_on_callback) {}

void AuthenticatorRequestClientDelegate::ShouldReturnAttestation(
    const std::string& relying_party_id,
    const device::FidoAuthenticator* authenticator,
    bool is_enterprise_attestation,
    base::OnceCallback<void(bool)> callback) {
  std::move(callback).Run(!is_enterprise_attestation);
}

void AuthenticatorRequestClientDelegate::ConfigureCable(
    const url::Origin& origin,
    device::CableRequestType request_type,
    absl::optional<device::ResidentKeyRequirement> resident_key_requirement,
    base::span<const device::CableDiscoveryData> pairings_from_extension,
    device::FidoDiscoveryFactory* fido_discovery_factory) {}

void AuthenticatorRequestClientDelegate::SelectAccount(
    std::vector<device::AuthenticatorGetAssertionResponse> responses,
    base::OnceCallback<void(device::AuthenticatorGetAssertionResponse)>
        callback) {
  // Automatically choose the first account to allow resident keys for virtual
  // authenticators without a browser implementation, e.g. on content shell.
  // TODO(crbug.com/991666): Provide a way to determine which account gets
  // picked.
  DCHECK(virtual_environment_);
  std::move(callback).Run(std::move(responses.at(0)));
}

void AuthenticatorRequestClientDelegate::DisableUI() {}

bool AuthenticatorRequestClientDelegate::IsWebAuthnUIEnabled() {
  return false;
}

void AuthenticatorRequestClientDelegate::SetVirtualEnvironment(
    bool virtual_environment) {
  virtual_environment_ = virtual_environment;
}

bool AuthenticatorRequestClientDelegate::IsVirtualEnvironmentEnabled() {
  return virtual_environment_;
}

void AuthenticatorRequestClientDelegate::SetConditionalRequest(
    bool is_conditional) {}

void AuthenticatorRequestClientDelegate::OnTransportAvailabilityEnumerated(
    device::FidoRequestHandlerBase::TransportAvailabilityInfo data) {}

bool AuthenticatorRequestClientDelegate::EmbedderControlsAuthenticatorDispatch(
    const device::FidoAuthenticator& authenticator) {
  return false;
}

void AuthenticatorRequestClientDelegate::BluetoothAdapterPowerChanged(
    bool is_powered_on) {}

void AuthenticatorRequestClientDelegate::FidoAuthenticatorAdded(
    const device::FidoAuthenticator& authenticator) {}

void AuthenticatorRequestClientDelegate::FidoAuthenticatorRemoved(
    base::StringPiece device_id) {}

bool AuthenticatorRequestClientDelegate::SupportsPIN() const {
  return false;
}

void AuthenticatorRequestClientDelegate::CollectPIN(
    CollectPINOptions options,
    base::OnceCallback<void(std::u16string)> provide_pin_cb) {
  NOTREACHED();
}

void AuthenticatorRequestClientDelegate::StartBioEnrollment(
    base::OnceClosure next_callback) {}

void AuthenticatorRequestClientDelegate::OnSampleCollected(
    int bio_samples_remaining) {}

void AuthenticatorRequestClientDelegate::FinishCollectToken() {}

void AuthenticatorRequestClientDelegate::OnRetryUserVerification(int attempts) {
}

#endif  // !IS_ANDROID

}  // namespace content
