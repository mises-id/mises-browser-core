#include "chrome/browser/ui/views/chrome_views_delegate.h"

#include "base/feature_list.h"
#include "chrome/common/chrome_features.h"

views::NativeWidget* ChromeViewsDelegate::CreateNativeWidget(
    views::Widget::InitParams* params,
    views::internal::NativeWidgetDelegate* delegate) {
  // By returning null Widget creates the default NativeWidget implementation.
  return nullptr;
}
