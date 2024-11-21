#ifndef MISES_BROWSER_EXTENSIONS_API_DEVELOPER_PRIVATE_DEVELOPER_PRIVATE_API_H_
#define MISES_BROWSER_EXTENSIONS_API_DEVELOPER_PRIVATE_DEVELOPER_PRIVATE_API_H_



#define DeveloperPrivateLoadUnpackedFunction DeveloperPrivateLoadUnpackedFunction_Chromium

#include "src/chrome/browser/extensions/api/developer_private/developer_private_api.h"

#undef DeveloperPrivateLoadUnpackedFunction

namespace extensions {
    namespace api {
        class DeveloperPrivateLoadUnpackedFunction
            : public DeveloperPrivateLoadUnpackedFunction_Chromium {
            public:
            DECLARE_EXTENSION_FUNCTION("developerPrivate.loadUnpacked",
                                        DEVELOPERPRIVATE_LOADUNPACKED)
            DeveloperPrivateLoadUnpackedFunction();

            protected:
            ~DeveloperPrivateLoadUnpackedFunction() override;

            // EntryPickerClient:
            void FileSelected(const ui::SelectedFileInfo& file, int index) override;

            void CheckFile(const base::FilePath& path);

            void ShowSelectFileDialog();
        };
    }
}

#endif  // CHROME_BROWSER_EXTENSIONS_API_DEVELOPER_PRIVATE_DEVELOPER_PRIVATE_API_H_
