#include "mises/browser/android/mises/mises_controller.h"
#include "chrome/renderer/chrome_render_thread_observer.h"
#include "chrome/renderer/searchbox/searchbox.h"
#include "gin/data_object_builder.h"
#include "gin/handle.h"
#include "gin/object_template_builder.h"
#include "gin/wrappable.h"

class MisesBindings : public gin::Wrappable<MisesBindings> {
 public:
  static gin::WrapperInfo kWrapperInfo;

  MisesBindings();
  ~MisesBindings() override;

 private:
  // gin::Wrappable.
  gin::ObjectTemplateBuilder GetObjectTemplateBuilder(
      v8::Isolate* isolate) final;

  // Handlers for JS properties.
  static std::u16string GetInfo();

  MisesBindings(const MisesBindings&) = delete;
  MisesBindings& operator=(const MisesBindings&) = delete;
};

#define GetMostVisitedItems GetMostVisitedSites
#include "src/chrome/renderer/searchbox/searchbox_extension.cc"
#undef GetMostVisitedItems

namespace {

static const char kDispatchMisesInfoResult[] =
    "if (window.chrome &&"
    "    window.chrome.embeddedSearch &&"
    "    window.chrome.embeddedSearch.mises &&"
    "    window.chrome.embeddedSearch.mises.oninfo &&"
    "    typeof window.chrome.embeddedSearch.mises"
    "        .oninfo === 'function') {"
    "  window.chrome.embeddedSearch.mises.oninfo(%s);"
    "  true;"
    "}";
}

// ----------------------------------------------------------------------------

gin::WrapperInfo MisesBindings::kWrapperInfo = {gin::kEmbedderNativeGin};

MisesBindings::MisesBindings() = default;

MisesBindings::~MisesBindings() = default;

gin::ObjectTemplateBuilder MisesBindings::GetObjectTemplateBuilder(
    v8::Isolate* isolate) {
  return gin::Wrappable<MisesBindings>::GetObjectTemplateBuilder(isolate)
      .SetProperty("info", &MisesBindings::GetInfo);
}

std::u16string  MisesBindings::GetInfo() {
  SearchBox* search_box = GetSearchBoxForCurrentContext();
  if (!search_box) return std::u16string();
  return search_box->mises_info();
} 


// static
v8::Local<v8::Value> NewTabPageBindings::GetMostVisitedExtensions(v8::Isolate* isolate) {
  const SearchBox* search_box = GetSearchBoxForCurrentContext();
  if (!search_box)
    return v8::Null(isolate);

  content::RenderFrame* render_frame = GetMainRenderFrameForCurrentContext();

  // This corresponds to "window.devicePixelRatio" in JavaScript.
  int render_frame_id = render_frame->GetRoutingID();

  std::vector<InstantMostVisitedItemIDPair> instant_mv_items;
  search_box->GetMostVisitedExtensions(&instant_mv_items);
  v8::Local<v8::Context> context = isolate->GetCurrentContext();
  v8::Local<v8::Object> v8_mv_items =
      v8::Array::New(isolate, instant_mv_items.size());
  for (size_t i = 0; i < instant_mv_items.size(); ++i) {
    InstantRestrictedID rid = instant_mv_items[i].first;
    v8_mv_items
        ->CreateDataProperty(
            context, i,
            GenerateMostVisitedItemData(isolate, 
                                    render_frame_id, rid, instant_mv_items[i].second))
        .Check();
  }
  return v8_mv_items;
}


bool NewTabPageBindings::IsIncognito(v8::Isolate* isolate) {
  return ChromeRenderThreadObserver::is_incognito_process();
}


// static
void NewTabPageBindings::OpenExtension(v8::Isolate* isolate,
                                               v8::Local<v8::Value> rid_value) {
  // Manually convert to integer, so that the string "\"1\"" is also accepted.
  absl::optional<int> rid = CoerceToInt(isolate, *rid_value);
  if (!rid.has_value())
    return;
  SearchBox* search_box = GetSearchBoxForCurrentContext();
  if (!search_box)
    return;
  search_box->OpenExtension(*rid);
} 

void SearchBoxExtension::DispatchMisesInfoChanged(blink::WebLocalFrame* frame, const std::u16string& info) {
  std::string escaped_info = base::GetQuotedJSONString(info);
  blink::WebString script(blink::WebString::FromUTF8(base::StringPrintf(
      kDispatchMisesInfoResult, escaped_info.c_str())));
  Dispatch(frame, script);
}

