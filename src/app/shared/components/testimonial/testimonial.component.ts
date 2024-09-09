import { Component, ElementRef, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrl: './testimonial.component.scss'
})
export class TestimonialComponent {
  testimonials:any;
  @ViewChild('textContent') textContent!: ElementRef;
  isTruncated = false;
  isExpanded: { [key: number]: boolean } = {};
constructor(private sharedService:SharedService){}

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    autoplay: true,
    dots: false,
    navSpeed: 700,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 3
      },
    },
    nav: true
  }

  ngOnInit(){
this.getTestimonials()
  }

  getTestimonials(){
this.sharedService.getTestimonials().subscribe((response:any)=>{
  console.log(response)
  this.testimonials = response.data
})
  }
  isTextTruncated(): boolean {
    const element = this.textContent?.nativeElement;
    return element?.scrollHeight > element?.clientHeight;
  }
  // Method to toggle the expanded state
  toggleExpand(index: number) {
    this.isExpanded[index] = !this.isExpanded[index];
  }
  ngAfterViewInit(){
    this.isTruncated = this.isTextTruncated();
  }
}
