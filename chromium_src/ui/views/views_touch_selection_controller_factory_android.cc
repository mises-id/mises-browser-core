#include "ui/views/views_touch_selection_controller_factory.h"


namespace views {

ViewsTouchEditingControllerFactory::ViewsTouchEditingControllerFactory() =
    default;

ui::TouchEditingControllerDeprecated*
ViewsTouchEditingControllerFactory::Create(ui::TouchEditable* client_view) {
    return nullptr;
}

}  // namespace views
