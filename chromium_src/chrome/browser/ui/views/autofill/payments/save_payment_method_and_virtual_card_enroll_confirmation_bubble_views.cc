#include "src/chrome/browser/ui/views/autofill/payments/save_payment_method_and_virtual_card_enroll_confirmation_bubble_views.cc"


namespace autofill {

#if BUILDFLAG(IS_ANDROID)
std::unique_ptr<views::View> CreateTitleView(
    const std::u16string& window_title,
    TitleWithIconAndSeparatorView::Icon icon_to_show) {
      return nullptr;
    }
#endif

}  // namespace autofill
