#ifndef MISES_COMPONENTS_AUTOFILL_CORE_BROWSER_FORM_DATA_IMPORTER_H_
#define MISES_COMPONENTS_AUTOFILL_CORE_BROWSER_FORM_DATA_IMPORTER_H_


#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)
#define CacheFetchedVirtualCard\
  CacheFetchedVirtualCard_Unused(){}\
  LocalCardMigrationManager* local_card_migration_manager() {\
    return NULL;\
  }\
  void CacheFetchedVirtualCard

#endif

#include "src/components/autofill/core/browser/form_data_importer.h"

#if BUILDFLAG(IS_ANDROID)
#undef CacheFetchedVirtualCard
#endif


#endif  // COMPONENTS_AUTOFILL_CORE_BROWSER_FORM_DATA_IMPORTER_H_
