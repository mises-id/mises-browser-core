#ifndef MISES_EXTENSIONS_BROWSER_EXTENSION_REGISTRAR_H_
#define MISES_EXTENSIONS_BROWSER_EXTENSION_REGISTRAR_H_


#define TerminateExtension TerminateExtension_Chromium(const ExtensionId& extension_id);\
    void TerminateExtension

#include "src/extensions/browser/extension_registrar.h"

#undef TerminateExtension


#endif  // EXTENSIONS_BROWSER_EXTENSION_REGISTRAR_H_
