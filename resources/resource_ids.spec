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
  "mises/ui/webui/resources/brave_webui_resources.grd": {
    "includes": [52000],
    "structures": [53000],
  },
  # This file is generated during the build.
  "<(SHARED_INTERMEDIATE_DIR)/mises/web-ui-ethereum_remote_client_page/ethereum_remote_client_page.grd": {
    "META": {"sizes": {"includes": [100]}},
    "includes": [54700],
  },
  "mises/components/mises_extension/extension/resources.grd": {
    "includes": [55000],
  },

  # This file is generated during the build.

}
