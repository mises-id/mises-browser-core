#include "extensions/common/constants.h"
#include "src/chrome/renderer/searchbox/searchbox.cc"

namespace{
//TODO const size_t kMaxInstantMostVisitedItemCacheSize = 500;

bool ItemIsExtension(InstantMostVisitedItemIDPair pair) 
{ 
  const GURL&url = pair.second.url;
  return url.SchemeIs(extensions::kExtensionScheme) && url.GetWithEmptyPath() == url;
}

bool ItemIsNotEnabled(InstantMostVisitedItemIDPair pair) 
{ 
  const GURL&url = pair.second.favicon;
  return !url.is_valid();
}

bool ItemIsNotExtension(InstantMostVisitedItemIDPair pair)
{ 
  return !ItemIsExtension(pair);
} 

}

void SearchBox::GetInstalledExtensions(
    std::vector<InstantMostVisitedItemIDPair>* items) const {
  most_visited_items_cache_.GetCurrentItems(items);
  items->erase(std::remove_if(items->begin(),items->end(),ItemIsNotExtension), items->end()); 
}
void SearchBox::GetMostVisitedExtensions(
    std::vector<InstantMostVisitedItemIDPair>* items) const {
  most_visited_items_cache_.GetCurrentItems(items);
  items->erase(std::remove_if(items->begin(),items->end(),ItemIsNotExtension), items->end()); 
  items->erase(std::remove_if(items->begin(),items->end(),ItemIsNotEnabled), items->end()); 
}

void SearchBox::GetMostVisitedSites(
    std::vector<InstantMostVisitedItemIDPair>* items) const {
  most_visited_items_cache_.GetCurrentItems(items);
 items->erase(std::remove_if(items->begin(),items->end(),ItemIsExtension), items->end());
}

void SearchBox::MisesInfoChanged(const std::u16string &info) {
  LOG(INFO) << "[Mises] SearchBox::MisesInfoChanged - Step 1";
  mises_info_ = info;
  if (can_run_js_in_renderframe_) {
      SearchBoxExtension::DispatchMisesInfoChanged(
          render_frame()->GetWebFrame(), info);
  }
}

void SearchBox::OpenExtension(
    InstantRestrictedID most_visited_item_id) {
  GURL url = GetURLForMostVisitedItem(most_visited_item_id);
  if (!url.is_valid())
    return;
  embedded_search_service_->OpenExtension(url);
}

