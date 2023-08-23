# Since recent changes upstream, Chromium is now using IDs up to ~40000
# (see end of //out/Component/gen/tools/gritsettings/default_resource_ids),
# so let's leave some padding after that and start assigning them on 45000.
{
  "SRCDIR": "../..",
  "mises/common/extensions/api/mises_api_resources.grd": {
    "includes": [45050],
  },
  "mises/components/resources/mises_components_resources.grd": {
    "includes": [45100],
  },
  # This file is generated during the build.
  "<(SHARED_INTERMEDIATE_DIR)/mises/browser/resources/settings/mises_settings_resources.grd": {
    "META": {"sizes": {"includes": [400]}},
    "includes": [45800],
  },


  "mises/app/mises_generated_resources.grd": {
    "includes": [46200],
    "messages": [46700],
  },
  "mises/app/theme/mises_theme_resources.grd": {
    "structures": [47200],
  },
  "mises/app/theme/mises_unscaled_resources.grd": {
    "includes": [47700],
  },
  "mises/components/resources/mises_components_strings.grd": {
    "messages": [50900]
  },
  "mises/components/mises_extension/extension/resources.grd": {
    "includes": [52000],
  },
  # This file is generated during the build.

  "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-brave_wallet_page/brave_wallet_page.grd": {
    "META": {"sizes": {"includes": [200]}},
    "includes": [54800],
  },


  "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-brave_wallet_panel/brave_wallet_panel.grd": {
    "META": {"sizes": {"includes": [200]}},
    "includes": [55000],
  },

  # This file is generated during the build.
  "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-ipfs/ipfs.grd": {
    "META": {"sizes": {"includes": [500]}},
    "includes": [56500],
  },

  # This file is generated during the build.
  "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-brave_wallet_script/brave_wallet_script.grd": {
    "META": {"sizes": {"includes": [250]}},
    "includes": [57000]
  },
  # This file is generated during the build.
  "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-trezor_bridge/trezor_bridge.grd": {
    "META": {"sizes": {"includes": [250]}},
    "includes": [58450]
  },
    "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-market_display/market_display.grd": {
    "META": {"sizes": {"includes": [250]}},
    "includes": [59200]
  },
  "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-ledger_bridge/ledger_bridge.grd": {
    "META": {"sizes": {"includes": [250]}},
    "includes": [59720]
  },
    "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-nft_display/nft_display.grd": {
    "META": {"sizes": {"includes": [250]}},
    "includes": [59970]
  },
}
