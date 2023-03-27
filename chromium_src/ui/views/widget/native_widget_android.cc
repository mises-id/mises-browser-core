#include "ui/views/widget/native_widget_android.h"

#include <memory>
#include <utility>

#include "base/functional/bind.h"
#include "base/location.h"
#include "base/task/single_thread_task_runner.h"
#include "base/strings/string_util.h"
#include "build/build_config.h"
#include "ui/base/class_property.h"
#include "ui/base/dragdrop/os_exchange_data.h"
#include "ui/base/ui_base_types.h"
#include "ui/compositor/layer.h"
#include "ui/display/display.h"
#include "ui/display/screen.h"
#include "ui/events/event.h"
#include "ui/gfx/canvas.h"
#include "ui/native_theme/native_theme_android.h"
#include "ui/views/drag_utils.h"
#include "ui/views/views_delegate.h"
#include "ui/views/widget/drop_helper.h"
#include "ui/views/widget/focus_manager_event_handler.h"
#include "ui/views/widget/native_widget_delegate.h"
#include "ui/views/widget/root_view.h"
#include "ui/views/widget/tooltip_manager_aura.h"
#include "ui/views/widget/widget_aura_utils.h"
#include "ui/views/widget/widget_delegate.h"
#include "ui/views/widget/window_reorderer.h"
#include "ui/wm/core/coordinate_conversion.h"
#include "ui/wm/core/shadow_types.h"
#include "ui/wm/core/transient_window_manager.h"
#include "ui/wm/core/window_animations.h"
#include "ui/wm/core/window_properties.h"
#include "ui/wm/core/window_util.h"
#include "ui/wm/public/activation_client.h"
#include "ui/wm/public/window_move_client.h"
#include "ui/android/window_android.h"

DEFINE_UI_CLASS_PROPERTY_TYPE(views::internal::NativeWidgetPrivate*)

namespace views {

////////////////////////////////////////////////////////////////////////////////
// NativeWidgetAndroid, public:

NativeWidgetAndroid::NativeWidgetAndroid(internal::NativeWidgetDelegate* delegate)
    : delegate_(delegate),
      ownership_(Widget::InitParams::NATIVE_WIDGET_OWNS_WIDGET),
      destroying_(false),
      is_active_(false),
      is_hidden_(false){
}

// static
void NativeWidgetAndroid::RegisterNativeWidgetForWindow(
      internal::NativeWidgetPrivate* native_widget,
      gfx::NativeWindow window) {
}

// static
void NativeWidgetAndroid::AssignIconToAuraWindow(gfx::NativeWindow window,
                                              const gfx::ImageSkia& window_icon,
                                              const gfx::ImageSkia& app_icon) {
}

// static
void NativeWidgetAndroid::SetShadowElevationFromInitParams(
    gfx::NativeWindow window,
    const Widget::InitParams& params) {
}

// static
void NativeWidgetAndroid::SetResizeBehaviorFromDelegate(WidgetDelegate* delegate,
                                                     gfx::NativeWindow window) {
}

////////////////////////////////////////////////////////////////////////////////
// NativeWidgetAndroid, internal::NativeWidgetPrivate implementation:

void NativeWidgetAndroid::InitNativeWidget(Widget::InitParams params) {
  delegate_->OnNativeWidgetCreated();
}

void NativeWidgetAndroid::OnWidgetInitDone() {}

std::unique_ptr<NonClientFrameView> NativeWidgetAndroid::CreateNonClientFrameView() {
  return nullptr;
}

bool NativeWidgetAndroid::ShouldUseNativeFrame() const {
  // There is only one frame type for aura.
  return false;
}

bool NativeWidgetAndroid::ShouldWindowContentsBeTransparent() const {
  return false;
}

void NativeWidgetAndroid::FrameTypeChanged() {
  // This is called when the Theme has changed; forward the event to the root
  // widget.
  GetWidget()->ThemeChanged();
  GetWidget()->GetRootView()->SchedulePaint();
}

Widget* NativeWidgetAndroid::GetWidget() {
  return delegate_->AsWidget();
}

const Widget* NativeWidgetAndroid::GetWidget() const {
  return delegate_->AsWidget();
}

gfx::NativeView NativeWidgetAndroid::GetNativeView() const {
  return window_;
}

gfx::NativeWindow NativeWidgetAndroid::GetNativeWindow() const {
  return window_;
}

Widget* NativeWidgetAndroid::GetTopLevelWidget() {
  NativeWidgetPrivate* native_widget = GetTopLevelNativeWidget(GetNativeView());
  return native_widget ? native_widget->GetWidget() : nullptr;
}

const ui::Compositor* NativeWidgetAndroid::GetCompositor() const {
  return nullptr;
}

const ui::Layer* NativeWidgetAndroid::GetLayer() const {
  return nullptr;
}

void NativeWidgetAndroid::ReorderNativeViews() {
}

void NativeWidgetAndroid::ViewRemoved(View* view) {
  DCHECK(drop_helper_.get() != nullptr);
  drop_helper_->ResetTargetViewIfEquals(view);
}

void NativeWidgetAndroid::SetNativeWindowProperty(const char* name, void* value) {
}

void* NativeWidgetAndroid::GetNativeWindowProperty(const char* name) const {
  return nullptr;
}

TooltipManager* NativeWidgetAndroid::GetTooltipManager() const {
  return tooltip_manager_.get();
}

void NativeWidgetAndroid::SetCapture() {
}

void NativeWidgetAndroid::ReleaseCapture() {
}

bool NativeWidgetAndroid::HasCapture() const {
  return false;
}

ui::InputMethod* NativeWidgetAndroid::GetInputMethod() {
  return nullptr;
}

void NativeWidgetAndroid::CenterWindow(const gfx::Size& size) {
}

void NativeWidgetAndroid::GetWindowPlacement(
    gfx::Rect* bounds,
    ui::WindowShowState* show_state) const {
}

bool NativeWidgetAndroid::SetWindowTitle(const std::u16string& title) {
  return true;
}

void NativeWidgetAndroid::SetWindowIcons(const gfx::ImageSkia& window_icon,
                                      const gfx::ImageSkia& app_icon) {
}

void NativeWidgetAndroid::InitModalType(ui::ModalType modal_type) {
}

gfx::Rect NativeWidgetAndroid::GetWindowBoundsInScreen() const {
  return gfx::Rect();
}

gfx::Rect NativeWidgetAndroid::GetClientAreaBoundsInScreen() const {
  return gfx::Rect();
}

gfx::Rect NativeWidgetAndroid::GetRestoredBounds() const {
  return gfx::Rect();
}

std::string NativeWidgetAndroid::GetWorkspace() const {
  return std::string();
}

void NativeWidgetAndroid::SetBounds(const gfx::Rect& bounds) {
}

void NativeWidgetAndroid::SetBoundsConstrained(const gfx::Rect& bounds) {
}

void NativeWidgetAndroid::SetSize(const gfx::Size& size) {
}

void NativeWidgetAndroid::StackAbove(gfx::NativeView native_view) {
}

void NativeWidgetAndroid::StackAtTop() {
}

void NativeWidgetAndroid::SetShape(std::unique_ptr<Widget::ShapeRects> shape) {
}

void NativeWidgetAndroid::Close() {
  LOG(INFO) << " NativeWidgetAndroid::Close";
  delegate_->OnNativeWidgetDestroying();
  if (!close_widget_factory_.HasWeakPtrs()) {
      base::SingleThreadTaskRunner::GetCurrentDefault()->PostTask(
        FROM_HERE, base::BindOnce(&NativeWidgetAndroid::CloseNow,
                                  close_widget_factory_.GetWeakPtr()));
  }
}

void NativeWidgetAndroid::CloseNow() {
  LOG(INFO) << " NativeWidgetAndroid::CloseNow";
  bool should_delete_this =
      (ownership_ == Widget::InitParams::NATIVE_WIDGET_OWNS_WIDGET);
  delegate_->OnNativeWidgetDestroyed();
  if (should_delete_this)
    delete this;
}

void NativeWidgetAndroid::Show(ui::WindowShowState show_state,
                            const gfx::Rect& restore_bounds) {
  is_hidden_ = false;
}

void NativeWidgetAndroid::Hide() {
  is_hidden_ = true;
}

bool NativeWidgetAndroid::IsVisible() const {
  return !is_hidden_;
}

void NativeWidgetAndroid::Activate() {
  is_active_ = true;
}

void NativeWidgetAndroid::Deactivate() {
  is_active_ = false;
}

bool NativeWidgetAndroid::IsActive() const {
  return is_active_;
}

void NativeWidgetAndroid::SetZOrderLevel(ui::ZOrderLevel order) {
}

ui::ZOrderLevel NativeWidgetAndroid::GetZOrderLevel() const {
  return ui::ZOrderLevel::kNormal;
}

void NativeWidgetAndroid::SetVisibleOnAllWorkspaces(bool always_visible) {
  // Not implemented on chromeos or for child widgets.
}

bool NativeWidgetAndroid::IsVisibleOnAllWorkspaces() const {
  return false;
}

void NativeWidgetAndroid::Maximize() {
}

void NativeWidgetAndroid::Minimize() {
}

bool NativeWidgetAndroid::IsMaximized() const {
  return true;
}

bool NativeWidgetAndroid::IsMinimized() const {
  return false;
}

void NativeWidgetAndroid::Restore() {
}

void NativeWidgetAndroid::SetFullscreen(bool fullscreen, int64_t target_display_id) {
}

bool NativeWidgetAndroid::IsFullscreen() const {
  return false;
}

void NativeWidgetAndroid::SetCanAppearInExistingFullscreenSpaces(
    bool can_appear_in_existing_fullscreen_spaces) {}

void NativeWidgetAndroid::SetOpacity(float opacity) {
}

void NativeWidgetAndroid::SetAspectRatio(const gfx::SizeF& aspect_ratio) {
}

void NativeWidgetAndroid::FlashFrame(bool flash) {
}

void NativeWidgetAndroid::RunShellDrag(View* view,
                                    std::unique_ptr<ui::OSExchangeData> data,
                                    const gfx::Point& location,
                                    int operation,
                                    ui::mojom::DragEventSource source) {
}

void NativeWidgetAndroid::SchedulePaintInRect(const gfx::Rect& rect) {
}

void NativeWidgetAndroid::ScheduleLayout() {
}

void NativeWidgetAndroid::SetCursor(const ui::Cursor& cursor) {
}

bool NativeWidgetAndroid::IsMouseEventsEnabled() const {
  return true;
}

bool NativeWidgetAndroid::IsMouseButtonDown() const {
  return false;
}

void NativeWidgetAndroid::ClearNativeFocus() {
}

gfx::Rect NativeWidgetAndroid::GetWorkAreaBoundsInScreen() const {
  return gfx::Rect();
}

Widget::MoveLoopResult NativeWidgetAndroid::RunMoveLoop(
    const gfx::Vector2d& drag_offset,
    Widget::MoveLoopSource source,
    Widget::MoveLoopEscapeBehavior escape_behavior) {
  return Widget::MoveLoopResult::kCanceled;
}

void NativeWidgetAndroid::EndMoveLoop() {
}

void NativeWidgetAndroid::SetVisibilityChangedAnimationsEnabled(bool value) {
}

void NativeWidgetAndroid::SetVisibilityAnimationDuration(
    const base::TimeDelta& duration) {
}

void NativeWidgetAndroid::SetVisibilityAnimationTransition(
    Widget::VisibilityTransition transition) {
}

bool NativeWidgetAndroid::IsTranslucentWindowOpacitySupported() const {
  return true;
}

ui::GestureRecognizer* NativeWidgetAndroid::GetGestureRecognizer() {
  return nullptr;
}

void NativeWidgetAndroid::OnSizeConstraintsChanged() {
}

std::string NativeWidgetAndroid::GetName() const {
  return std::string();
}

base::WeakPtr<internal::NativeWidgetPrivate> NativeWidgetAndroid::GetWeakPtr() {
  return close_widget_factory_.GetWeakPtr();
}
bool NativeWidgetAndroid::IsStackedAbove(gfx::NativeView native_view) {return false;}
const gfx::ImageSkia* NativeWidgetAndroid::GetWindowIcon() {return NULL;}
const gfx::ImageSkia* NativeWidgetAndroid::GetWindowAppIcon() {return NULL;}
ui::GestureConsumer* NativeWidgetAndroid::GetGestureConsumer() {return NULL;}
void NativeWidgetAndroid::OnNativeViewHierarchyWillChange() {}
void NativeWidgetAndroid::OnNativeViewHierarchyChanged() {}

////////////////////////////////////////////////////////////////////////////////
// NativeWidgetAndroid, protected:

NativeWidgetAndroid::~NativeWidgetAndroid() {
  LOG(INFO) << " NativeWidgetAndroid::~NativeWidgetAndroid";
  destroying_ = true;
  if (ownership_ == Widget::InitParams::NATIVE_WIDGET_OWNS_WIDGET)
    delete delegate_;
  else
    CloseNow();
}

////////////////////////////////////////////////////////////////////////////////
// NativeWidgetAndroid, private:

void NativeWidgetAndroid::SetInitialFocus(ui::WindowShowState show_state) {
}

////////////////////////////////////////////////////////////////////////////////
// Widget, public:


// static
void Widget::CloseAllSecondaryWidgets() {
}

namespace internal {

////////////////////////////////////////////////////////////////////////////////
// internal::NativeWidgetPrivate, public:

// static
NativeWidgetPrivate* NativeWidgetPrivate::CreateNativeWidget(
    internal::NativeWidgetDelegate* delegate) {
  return new NativeWidgetAndroid(delegate);
}

// static
NativeWidgetPrivate* NativeWidgetPrivate::GetNativeWidgetForNativeView(
    gfx::NativeView native_view) {
  return nullptr;
}

// static
NativeWidgetPrivate* NativeWidgetPrivate::GetNativeWidgetForNativeWindow(
    gfx::NativeWindow native_window) {
  return nullptr;
}

// static
NativeWidgetPrivate* NativeWidgetPrivate::GetTopLevelNativeWidget(
    gfx::NativeView native_view) {
  return nullptr;
}

// static
void NativeWidgetPrivate::GetAllChildWidgets(gfx::NativeView native_view,
                                             Widget::Widgets* children) {
}

// static
void NativeWidgetPrivate::GetAllOwnedWidgets(gfx::NativeView native_view,
                                             Widget::Widgets* owned) {
}

// static
void NativeWidgetPrivate::ReparentNativeView(gfx::NativeView native_view,
                                             gfx::NativeView new_parent) {
}

// static
gfx::NativeView NativeWidgetPrivate::GetGlobalCapture(
    gfx::NativeView native_view) {
  return nullptr;
}

}  // namespace internal
}  // namespace views

