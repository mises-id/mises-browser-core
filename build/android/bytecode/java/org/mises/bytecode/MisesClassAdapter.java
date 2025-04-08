/* Copyright (c) 2020 The Mises Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesClassAdapter {
    public static ClassVisitor createAdapter(ClassVisitor chain) {
        chain = new MisesActivityClassAdapter(chain);
        chain = new MisesAppHooksClassAdapter(chain);
        chain = new MisesAppMenuClassAdapter(chain);
        chain = new MisesApplicationImplBaseClassAdapter(chain);
        chain = new MisesAutocompleteCoordinatorClassAdapter(chain);
        chain = new MisesAutocompleteMediatorClassAdapter(chain);
        chain = new MisesAutofillPopupBridgeClassAdapter(chain);
        chain = new MisesBookmarkUtilsClassAdapter(chain);
        chain = new MisesBottomControlsCoordinatorClassAdapter(chain);
        chain = new MisesBottomControlsMediatorClassAdapter(chain);
        chain = new MisesCachedFlagClassAdapter(chain);
        chain = new MisesCommandLineInitUtilClassAdapter(chain);
        chain = new MisesContentSettingsResourcesClassAdapter(chain);
        chain = new MisesCustomizationProviderDelegateImplClassAdapter(chain);
        chain = new MisesDefaultBrowserPromoUtilsClassAdapter(chain);
        chain = new MisesDropdownItemViewInfoListBuilderClassAdapter(chain);
        chain = new MisesDropdownItemViewInfoListManagerClassAdapter(chain);
        chain = new MisesDynamicColorsClassAdapter(chain);
        chain = new MisesEditUrlSuggestionProcessorClassAdapter(chain);
        chain = new MisesFeedSurfaceCoordinatorClassAdapter(chain);
        chain = new MisesFeedSurfaceMediatorClassAdapter(chain);
        chain = new MisesFourStateCookieSettingsPreferenceBaseClassAdapter(chain);
        chain = new MisesFreIntentCreatorClassAdapter(chain);
        chain = new MisesHomepageManagerClassAdapter(chain);
        chain = new MisesHubManagerImplClassAdapter(chain);
        chain = new MisesIncognitoToggleTabLayoutClassAdapter(chain);
        chain = new MisesIntentHandlerClassAdapter(chain);
        chain = new MisesLaunchIntentDispatcherClassAdapter(chain);
        chain = new MisesLocationBarCoordinatorClassAdapter(chain);
        chain = new MisesLocationBarLayoutClassAdapter(chain);
        chain = new MisesLocationBarMediatorClassAdapter(chain);
        chain = new MisesLogoMediatorClassAdapter(chain);
        chain = new MisesMainPreferenceBaseClassAdapter(chain);
        chain = new MisesManageAccountDevicesLinkViewClassAdapter(chain);
        chain = new MisesManageSyncSettingsClassAdapter(chain);
        chain = new MisesTranslateCompactInfoBarBaseClassAdapter(chain);
        chain = new MisesMenuButtonCoordinatorClassAdapter(chain);
        chain = new MisesMimeUtilsClassAdapter(chain);
        chain = new MisesMostVisitedTilesLayoutBaseClassAdapter(chain);
        chain = new MisesMostVisitedTilesMediatorClassAdapter(chain);
        chain = new MisesNewTabPageClassAdapter(chain);
        chain = new MisesNewTabPageLayoutClassAdapter(chain);
        chain = new MisesQuickActionSearchWidgetProviderClassAdapter(chain);
        chain = new MisesNotificationManagerProxyImplClassAdapter(chain);
        chain = new MisesNotificationPermissionRationaleDialogControllerClassAdapter(chain);
        chain = new MisesPartnerBookmarksDelegateImplClassAdapter(chain);
        chain = new MisesPasswordSettingsBaseClassAdapter(chain);
        chain = new MisesPermissionDialogDelegateClassAdapter(chain);
        chain = new MisesPermissionDialogModelClassAdapter(chain);
        chain = new MisesPureJavaExceptionReporterClassAdapter(chain);
        chain = new MisesQueryTileSectionClassAdapter(chain);
        chain = new MisesReaderModeManagerClassAdapter(chain);
        chain = new MisesReturnToChromeUtilClassAdapter(chain);
        chain = new MisesSearchEngineAdapterClassAdapter(chain);
        chain = new MisesSettingsLauncherImplClassAdapter(chain);
        chain = new MisesShareDelegateImplClassAdapter(chain);
        chain = new MisesSingleCategorySettingsClassAdapter(chain);
        chain = new MisesSingleWebsiteSettingsClassAdapter(chain);
        chain = new MisesSiteSettingsCategoryClassAdapter(chain);
        chain = new MisesSiteSettingsDelegateClassAdapter(chain);
        chain = new MisesSiteSettingsPreferencesBaseClassAdapter(chain);
        chain = new MisesStatusMediatorClassAdapter(chain);
        chain = new MisesStrictPreferenceKeyCheckerClassAdapter(chain);
        chain = new MisesTabGroupUiCoordinatorClassAdapter(chain);
        chain = new MisesTabSwitcherModeTTCoordinatorClassAdapter(chain);
        chain = new MisesTabSwitcherModeTopToolbarClassAdapter(chain);
        chain = new MisesTabSwitcherPaneBaseClassAdapter(chain);
        chain = new MisesTabUiThemeProviderClassAdapter(chain);
        chain = new MisesTabbedActivityClassAdapter(chain);
        chain = new MisesTabbedNavigationBarColorControllerBaseClassAdapter(chain);
        chain = new MisesTabbedRootUiCoordinatorClassAdapter(chain);
        chain = new MisesTemplateUrlServiceFactoryClassAdapter(chain);
        chain = new MisesThemeUtilsClassAdapter(chain);
        chain = new MisesTileViewClassAdapter(chain);
        chain = new MisesToolbarLayoutClassAdapter(chain);
        chain = new MisesToolbarManagerClassAdapter(chain);
        chain = new MisesTopToolbarCoordinatorClassAdapter(chain);
        chain = new MisesVariationsSeedFetcherClassAdapter(chain);
        chain = new MisesWebsiteClassAdapter(chain);
        chain = new MisesWebsitePermissionsFetcherClassAdapter(chain);
        chain = new MisesBottomSheetControllerImplClassAdapter(chain);
        return chain;
    }
}
