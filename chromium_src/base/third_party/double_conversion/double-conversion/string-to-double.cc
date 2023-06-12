#include "src/base/third_party/double_conversion/double-conversion/string-to-double.cc"

namespace double_conversion {
double StringToDoubleConverter::StringToIeee(
    const char* buffer,
    int length,
    int* processed_characters_count,
    bool read_as_double) const {
  return StringToIeee(buffer, length, read_as_double, processed_characters_count);
}
}  // namespace double_conversion