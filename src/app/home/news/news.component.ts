import { Component, OnInit } from '@angular/core';
import { NewsService } from './news.service';

@Component({
  selector: 'app-home-news',
  templateUrl: './news.component.html',
  styleUrls: ['../home.component.scss', './news.component.scss']
})
export class HomeNewsComponent implements OnInit { 

  public rss_feeds: any[];

  constructor(private news: NewsService){ }

  ngOnInit() {
    this.rss_feeds = this.news.rss_feeds;
  }


}
