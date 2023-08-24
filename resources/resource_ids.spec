# Since recent changes upstream, Chromium is now using IDs up to ~40000
# (see end of //out/Component/gen/tools/gritsettings/default_resource_ids),
# so let's leave some padding after that and start assigning them on 45000.
{
  "SRCDIR": "../..",
  "mises/common/extensions/api/mises_api_resources.grd": {
    "includes": [50050],
  },
  "mises/components/resources/mises_components_resources.grd": {
    "includes": [50100],
  },
  # This file is generated during the build.
  "<(SHARED_INTERMEDIATE_DIR)/mises/browser/resources/settings/mises_settings_resources.grd": {
    "META": {"sizes": {"includes": [400]}},
    "includes": [50800],
  },


  "mises/app/mises_generated_resources.grd": {
    "includes": [51200],
    "messages": [51700],
  },
  "mises/app/theme/mises_theme_resources.grd": {
    "structures": [52200],
  },
  "mises/app/theme/mises_unscaled_resources.grd": {
    "includes": [52700],
  },
  "mises/components/resources/mises_components_strings.grd": {
    "messages": [55900]
  },
  "mises/components/mises_extension/extension/resources.grd": {
    "includes": [57000],
  },
  # This file is generated during the build.

  "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-brave_wallet_page/brave_wallet_page.grd": {
    "META": {"sizes": {"includes": [200]}},
    "includes": [59800],
  },


  "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-brave_wallet_panel/brave_wallet_panel.grd": {
    "META": {"sizes": {"includes": [200]}},
    "includes": [60000],
  },

  # This file is generated during the build.
  "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-ipfs/ipfs.grd": {
    "META": {"sizes": {"includes": [500]}},
    "includes": [61500],
  },

  # This file is generated during the build.
  "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-brave_wallet_script/brave_wallet_script.grd": {
    "META": {"sizes": {"includes": [250]}},
    "includes": [62000]
  },
  # This file is generated during the build.
  "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-trezor_bridge/trezor_bridge.grd": {
    "META": {"sizes": {"includes": [250]}},
    "includes": [63450]
  },
    "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-market_display/market_display.grd": {
    "META": {"sizes": {"includes": [250]}},
    "includes": [64200]
  },
  "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-ledger_bridge/ledger_bridge.grd": {
    "META": {"sizes": {"includes": [250]}},
    "includes": [64720]
  },
    "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-nft_display/nft_display.grd": {
    "META": {"sizes": {"includes": [250]}},
    "includes": [64970]
  },
}
