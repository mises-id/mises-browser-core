#include "base/command_line.h"
#include "base/strings/string_number_conversions.h"
#include "components/ungoogled/ungoogled_switches.h"
#include "third_party/blink/renderer/platform/fonts/font_platform_data.h"
#include "third_party/blink/renderer/platform/fonts/font_face_creation_params.h"
namespace blink {
  bool MisesGetFontPlatformData(const FontFaceCreationParams& creation_params) {
    const base::CommandLine* command_line = base::CommandLine::ForCurrentProcess();
    if (command_line->HasSwitch(switches::kFingerprint)) {
      static const char* basic_fonts[] = {
        "Arial",
        "Times New Roman",
        "Courier New",
        "Georgia",
        "Verdana"
      };

      if (creation_params.CreationType() == kCreateFontByFamily) {
        bool is_basic_font = false;
        for (const char* font : basic_fonts) {
          if (creation_params.Family() == font) {
            is_basic_font = true;
            break;
          }
        }
        if (!is_basic_font) {
          std::string fingerprint = command_line->GetSwitchValueASCII(switches::kFingerprint);
          uint32_t seed;
          if (base::StringToUint(fingerprint, &seed)) {
            uint32_t hash = std::hash<String>{}(creation_params.Family());
            hash = hash ^ seed; 
            if (hash % 2 == 0) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }
}
#include "src/third_party/blink/renderer/platform/fonts/font_cache.cc"
