#include "src/chrome/browser/media/webrtc/media_capture_devices_dispatcher.cc"


#if BUILDFLAG(IS_ANDROID)

DesktopCaptureAccessHandler::DesktopCaptureAccessHandler()
    : picker_factory_(nullptr),
      display_notification_(true),
      web_contents_collection_(this) {}


DesktopCaptureAccessHandler::DesktopCaptureAccessHandler(
    std::unique_ptr<DesktopMediaPickerFactory> picker_factory)
    : picker_factory_(std::move(picker_factory)),
      display_notification_(false),
      web_contents_collection_(this) {}

DesktopCaptureAccessHandler::~DesktopCaptureAccessHandler() = default;

void DesktopCaptureAccessHandler::ProcessScreenCaptureAccessRequest(
    content::WebContents* web_contents,
    const extensions::Extension* extension,
    std::unique_ptr<PendingAccessRequest> pending_request) {
}

bool DesktopCaptureAccessHandler::SupportsStreamType(
    content::WebContents* web_contents,
    const blink::mojom::MediaStreamType type,
    const extensions::Extension* extension) {
  return false;
}

bool DesktopCaptureAccessHandler::CheckMediaAccessPermission(
    content::RenderFrameHost* render_frame_host,
    const url::Origin& security_origin,
    blink::mojom::MediaStreamType type,
    const extensions::Extension* extension) {
  return false;
}

void DesktopCaptureAccessHandler::HandleRequest(
    content::WebContents* web_contents,
    const content::MediaStreamRequest& request,
    content::MediaResponseCallback callback,
    const extensions::Extension* extension) {

}
void DesktopCaptureAccessHandler::UpdateMediaRequestState(
    int render_process_id,
    int render_frame_id,
    int page_request_id,
    blink::mojom::MediaStreamType stream_type,
    content::MediaRequestState state) {

}
void DesktopCaptureAccessHandler::WebContentsDestroyed(
    content::WebContents* web_contents) {
}
TabCaptureAccessHandler::TabCaptureAccessHandler() = default;
TabCaptureAccessHandler::~TabCaptureAccessHandler() = default;


bool TabCaptureAccessHandler::SupportsStreamType(
    content::WebContents* web_contents,
    const blink::mojom::MediaStreamType type,
    const extensions::Extension* extension) {
  return false;
}

bool TabCaptureAccessHandler::CheckMediaAccessPermission(
    content::RenderFrameHost* render_frame_host,
    const url::Origin& security_origin,
    blink::mojom::MediaStreamType type,
    const extensions::Extension* extension) {
  return false;
}

void TabCaptureAccessHandler::HandleRequest(
    content::WebContents* web_contents,
    const content::MediaStreamRequest& request,
    content::MediaResponseCallback callback,
    const extensions::Extension* extension) {
}
#endif