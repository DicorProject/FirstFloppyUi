import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  isBrowser!: boolean;
constructor(@Inject(DOCUMENT) private dom:any, @Inject(PLATFORM_ID) platformId: Object){
  this.isBrowser = isPlatformBrowser(platformId);
  if(this.isBrowser){
    this.createCanonicalLink
  }
}
createCanonicalLink() {
  let canURL = 'https://www.firstfloppy.com/about';
  let link: HTMLLinkElement = this.dom.createElement('link');
  link.setAttribute('rel', 'canonical');
  this.dom.head.appendChild(link);
  link.setAttribute('href', canURL);
}

}
