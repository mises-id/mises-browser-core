#include "src/base/values.cc"

namespace base {

  bool ListValue::GetDictionary(size_t index,
                                const DictionaryValue** out_value) const {
    const auto& list = GetListDeprecated();
    if (list.size() <= index)
      return false;
    const base::Value& value = list[index];
    if (!value.is_dict())
      return false;

    if (out_value)
      *out_value = static_cast<const DictionaryValue*>(&value);

    return true;
  }

  bool ListValue::GetDictionary(size_t index, DictionaryValue** out_value) {
    return as_const(*this).GetDictionary(
        index, const_cast<const DictionaryValue**>(out_value));
  }


}