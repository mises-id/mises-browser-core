#include "ui/views/controls/menu/menu_config.h"

namespace views {

void MenuConfig::Init() {
  arrow_to_edge_padding = 6;
}

void MenuConfig::InitPlatformCR2023() {
  context_menu_font_list = font_list;
}

}  // namespace views
