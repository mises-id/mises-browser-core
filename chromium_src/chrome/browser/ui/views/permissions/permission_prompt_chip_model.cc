// Copyright 2022 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "build/build_config.h"

#if !BUILDFLAG(IS_ANDROID)
#include "src/chrome/browser/ui/views/permissions/permission_prompt_chip_model.cc"

#else

#include "chrome/browser/ui/views/permissions/permission_prompt_chip_model.h"
#include "base/check.h"
#include "base/strings/utf_string_conversions.h"
#include "chrome/browser/ui/views/location_bar/omnibox_chip_theme.h"
#include "components/permissions/permission_actions_history.h"
#include "components/permissions/permission_request_manager.h"
#include "components/permissions/permission_util.h"
#include "components/permissions/request_type.h"
#include "components/strings/grit/components_strings.h"
#include "ui/base/l10n/l10n_util.h"
#include "ui/gfx/vector_icon_types.h"


PermissionPromptChipModel::PermissionPromptChipModel(
    base::WeakPtr<permissions::PermissionPrompt::Delegate> delegate)
    : delegate_(delegate),
      allowed_icon_(gfx::kNoneIcon),
      blocked_icon_(gfx::kNoneIcon) {
}
PermissionPromptChipModel::~PermissionPromptChipModel() = default;

void PermissionPromptChipModel::UpdateAutoCollapsePromptChipState(
    bool is_collapsed) {
}

bool PermissionPromptChipModel::IsExpandAnimationAllowed() {
  return false;
}

void PermissionPromptChipModel::UpdateWithUserDecision(
    permissions::PermissionAction user_decision) {

}

#endif