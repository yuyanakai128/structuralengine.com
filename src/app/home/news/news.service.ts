import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private url: string = "https://asia-northeast1-the-structural-engine.cloudfunctions.net/note-rss";
  public rss_feeds: any[];

  constructor(private http: HttpClient){
    this.rss_feeds = [];

    this.http.get(this.url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      })
    })
    .subscribe(
      response => {
        // 通信成功時の処理（成功コールバック）
        console.log('通信成功!!', response);
        const res: any = response;
        const entries = res.entries;
        let counter = 0;
        for(const entry of entries){
          const link = entry.link;
          let thumbnail = "./assets/parallax/SkyCiv-Suite-min.jpg";
          for(const l of entry.links){
            const t: string = l.type;
            if(t.includes('image')){
              thumbnail = l.href;
              break;
            }
          }
          if('media_thumbnail' in entry) {
            thumbnail = entry.media_thumbnail[0].url;
          }

          const title = entry.title;
          const description = entry.summary;
          const pubDate_y = entry.published_parsed[0];
          const pubDate_m = entry.published_parsed[1];
          const pubDate_d = entry.published_parsed[2];

          this.rss_feeds.push({
            link,
            thumbnail,
            title,
            description,
            pubDate_y,
            pubDate_m,
            pubDate_d
          })
          counter++;
          if(counter>3){
            break; // 4つを上限とする
          }
        }

      },
      error => {
        console.log(error);
      }
    );

  }



}
