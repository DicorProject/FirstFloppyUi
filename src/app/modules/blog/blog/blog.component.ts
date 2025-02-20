import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {
 isBrowser!: boolean;
constructor(@Inject(DOCUMENT) private dom:any, @Inject(PLATFORM_ID) platformId: Object){
  this.isBrowser = isPlatformBrowser(platformId);
  if(this.isBrowser){
    this.createCanonicalLink
  }
}
createCanonicalLink() {
  let canURL = 'https://www.firstfloppy.com/blog';
  let link: HTMLLinkElement = this.dom.createElement('link');
  link.setAttribute('rel', 'canonical');
  this.dom.head.appendChild(link);
  link.setAttribute('href', canURL);
}
 
}
