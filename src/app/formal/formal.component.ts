import { Component, OnInit } from "@angular/core";
import { NewsService } from "../home/news/news.service";

@Component({
  selector: "app-formal",
  templateUrl: "./formal.component.html",
  styleUrls: ["./formal.component.scss"],
})
export class FormalComponent implements OnInit {
  constructor(private news: NewsService) {}
  public rss_feeds: any[];

  ngOnInit() {
    this.rss_feeds = this.news.rss_feeds;
  }
}
