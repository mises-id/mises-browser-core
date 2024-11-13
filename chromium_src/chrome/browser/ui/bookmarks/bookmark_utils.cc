#include "src/chrome/browser/ui/bookmarks/bookmark_utils.cc"

#if BUILDFLAG(IS_ANDROID)

namespace chrome {
ui::ImageModel GetBookmarkFolderIcon(
    BookmarkFolderIconType icon_type,
    absl::variant<ui::ColorId, SkColor> color) {
    return ui::ImageModel();
}

}

#endif