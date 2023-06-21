#ifndef MISES_RENDERER_SEARCHBOX_SEARCHBOX_H_
#define MISES_RENDERER_SEARCHBOX_SEARCHBOX_H_

#define GetMostVisitedItems \
  GetMostVisitedSites(\
      std::vector<InstantMostVisitedItemIDPair>* items) const;\
  void GetMostVisitedExtensions(\
      std::vector<InstantMostVisitedItemIDPair>* items) const;\
  void GetInstalledExtensions(\
      std::vector<InstantMostVisitedItemIDPair>* items) const;\
  void MisesInfoChanged(const std::u16string &info) override;\
  const std::u16string &mises_info(){ return mises_info_;}\
  void OpenExtension(InstantRestrictedID most_visited_item_id);\
  std::u16string mises_info_;\
  void GetMostVisitedItems
#include "src/chrome/renderer/searchbox/searchbox.h"
#undef GetMostVisitedItems


#endif  // CHROME_RENDERER_SEARCHBOX_SEARCHBOX_H_
