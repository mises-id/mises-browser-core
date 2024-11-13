#include "src/chrome/browser/ui/tabs/tab_features.cc"

#if BUILDFLAG(IS_ANDROID)

FedCmAccountSelectionViewController::FedCmAccountSelectionViewController(
    tabs::TabInterface* tab)
    : tab_(tab) {
}
FedCmAccountSelectionViewController::~FedCmAccountSelectionViewController() {}

#endif