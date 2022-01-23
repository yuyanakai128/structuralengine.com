import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { LanguagesService } from "../providers/languages.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss", "../home/home.component.scss"],
})
export class HeaderComponent {
  constructor(
    public auth: AngularFireAuth,
    public language: LanguagesService
  ) {}
}
