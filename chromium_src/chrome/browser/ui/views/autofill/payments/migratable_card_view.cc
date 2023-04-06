#include "src/chrome/browser/ui/views/autofill/payments/migratable_card_view.cc"


namespace autofill {

#if BUILDFLAG(IS_ANDROID)
    MigratableCreditCard::~MigratableCreditCard() {}
#endif

}  // namespace autofill
