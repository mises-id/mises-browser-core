#ifndef MISES_COMPONENTS_OMNIBOX_BROWSER_OMNIBOX_EDIT_MODEL_H_
#define MISES_COMPONENTS_OMNIBOX_BROWSER_OMNIBOX_EDIT_MODEL_H_


#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)

#define IsStarredMatch IsStarredMatch_Unused(const AutocompleteMatch& match) const{return false;};\
  gfx::Image GetMatchIcon(const AutocompleteMatch& match,SkColor vector_icon_color){return gfx::Image(); };\
  bool IsStarredMatch

#endif 
#include "src/components/omnibox/browser/omnibox_edit_model.h"
#if BUILDFLAG(IS_ANDROID)
#undef IsStarredMatch
#endif 

#endif  // COMPONENTS_OMNIBOX_BROWSER_OMNIBOX_EDIT_MODEL_H_
