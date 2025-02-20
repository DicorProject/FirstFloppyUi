import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesDetailService } from '../../service/services-detail.service';
import { environment } from '../../../../../environments/environment.development';
import { DOCUMENT, isPlatformBrowser, ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  serviceDataList:any[]=[];
  originalList:any[]=[];
  apiUrl: string = environment.ApiBaseUrl;
  subSategories:any;
  isBrowser!: boolean;
  constructor(
    private router: Router,
    private service:ServicesDetailService,
    private viewportScroller: ViewportScroller,
    @Inject(DOCUMENT) private dom:any,
    @Inject(PLATFORM_ID) platformId: Object
  ){
    this.isBrowser = isPlatformBrowser(platformId);
  }
ngOnInit(){
  this.viewportScroller.scrollToPosition([0, 0]); // Scroll to the top of the page
   // ServiceCategoryList
   this.service.getServiceList().subscribe((res:any)=>{
    this.serviceDataList = res.data;
    this.originalList = [...res?.data];
      this.serviceDataList = this.serviceDataList?.filter((iterable:any)=> iterable?.status === 1);
   })
if(this.isBrowser){
   this.createCanonicalLink()
}
}

createCanonicalLink() {
  let canURL = 'https://www.firstfloppy.com/services';
  let link: HTMLLinkElement = this.dom.createElement('link');
  link.setAttribute('rel', 'canonical');
  this.dom.head.appendChild(link);
  link.setAttribute('href', canURL);
  console.log("184")
}

  goToCategory(card: any) {
 // Fetch the updated subcategory list based on the selected value
 this.service.getSubCategoryBySpecificationName(card.mainId).subscribe((res:any) => {
  this.subSategories = res.data; // Update the category list with new data

  if (this.subSategories && this.subSategories.length > 0) {
    const selectedSubCategoryName = this.subSategories[0].serviceName;

    // Set navigation options
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';

    // Navigate using updated category name and ID
    // this.router.navigate([`/services/category/${selectedSubCategoryName?.replaceAll("/","$")}/${card.mainId}`]);
    this.router.navigate([`${card.categoryseourl}`]);
  } 
}, (error:any) => {
  console.error('Error fetching subcategories:', error);
});


  }
  
}
