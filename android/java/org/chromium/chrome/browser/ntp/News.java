package org.chromium.chrome.browser.ntp;

import java.util.Date;

// import org.chromium.url.GURL;

public class News {
    public final String id;
    public final String title;
    // public final String desc;
    public final String url;
    public final String imageURL;
    public final String source;
    public final Date publishedAt; 

    public News(
        String id,
        String title,
        String url,
        String imageURL,
        String source,
        Date publishedAt
    ) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.imageURL = imageURL;
        this.source = source;
        this.publishedAt = publishedAt;
    }
}