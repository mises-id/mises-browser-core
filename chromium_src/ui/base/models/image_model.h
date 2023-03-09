#ifndef MISES_UI_BASE_MODELS_IMAGE_MODEL_H_
#define MISES_UI_BASE_MODELS_IMAGE_MODEL_H_

class GlobalError;
#define IsImageGenerator\
  IsImageGenerator_Unused(){return false;};\
  private: friend class ::GlobalError;\
  public: bool IsImageGenerator

#include "src/ui/base/models/image_model.h"
#undef IsImageGenerator


#endif  // UI_BASE_MODELS_IMAGE_MODEL_H_
