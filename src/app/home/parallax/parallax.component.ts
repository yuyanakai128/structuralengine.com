import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-parallax',
  templateUrl: './parallax.component.html',
  styleUrls: ['../home.component.scss','./parallax.component.scss']
})
export class ParallaxComponent implements OnInit {

  public isParallax: boolean;
  private Parallax: any

  constructor() {
    this.Parallax = require('parallax-js');
    this.isParallax = true
  }

  ngOnInit() {
    this.setSize(window.innerWidth);
  }

  ngAfterContentInit() {
    const scene = document.getElementById('scene');
    const parallaxInstance = new this.Parallax(scene, {
      relativeInput: true,
      haverOnly: true
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSize(window.innerWidth);
  }

  private setSize(width: number){
    console.log(width)
  }

}
