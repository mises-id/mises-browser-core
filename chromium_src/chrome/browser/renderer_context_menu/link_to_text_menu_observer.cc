#include "src/chrome/browser/renderer_context_menu/link_to_text_menu_observer.cc"

namespace enterprise_data_protection {
void IsClipboardCopyAllowedByPolicy(
    const content::ClipboardEndpoint& source,
    const content::ClipboardMetadata& metadata,
    const content::ClipboardPasteData& data,
    content::ContentBrowserClient::IsClipboardCopyAllowedCallback callback) {
  std::move(callback).Run(metadata.format_type, data, std::nullopt);
}
}