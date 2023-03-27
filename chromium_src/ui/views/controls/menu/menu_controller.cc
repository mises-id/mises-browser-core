
#include "src/ui/views/controls/menu/menu_controller.cc"

#if BUILDFLAG(IS_ANDROID)
namespace views {
  std::unique_ptr<MenuPreTargetHandler> MenuPreTargetHandler::Create(views::MenuController*, views::Widget*) {
    return nullptr;
  }
}
#endif