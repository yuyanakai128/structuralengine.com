import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss", "../home/home.component.scss"],
})
export class HeaderComponent {
  constructor(public auth: AngularFireAuth) {}
}
