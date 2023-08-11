
package org.chromium.chrome.browser.suggestions;

import org.chromium.chrome.browser.suggestions.tile.TileSectionType;
import org.chromium.chrome.browser.suggestions.tile.TileSource;
import org.chromium.chrome.browser.suggestions.tile.TileTitleSource;
import org.chromium.url.GURL;


public class MisesSiteSuggestion extends SiteSuggestion {
  public GURL iconUrl;
  public String extensionID;
  public MisesSiteSuggestion(String title, GURL url, int titleSource, int source, int sectionType) {
      super(title, url, titleSource, source, sectionType);
  }
  public void setIconUrl(final GURL url) {
    iconUrl = url;
  }
  public void setExtensionID(final String id) {
    extensionID = id;
  }
}