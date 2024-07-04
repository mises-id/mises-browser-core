package org.chromium.chrome.browser.ntp;

import java.util.Date;

// import org.chromium.url.GURL;

public class News {
    public final String id;
    public final String title;
    // public final String desc;
    // 新闻链接
    public final String link;
    // 缩略图
    public final String thumbnail;
    public final String source;
    public final Date publishedAt; 

    public News(
        String id,
        String title,
        String link,
        String thumbnail,
        String source,
        Date publishedAt
    ) {
        this.id = id;
        this.title = title;
        this.link = link;
        this.thumbnail = thumbnail;
        this.source = source;
        this.publishedAt = publishedAt;
    }
}