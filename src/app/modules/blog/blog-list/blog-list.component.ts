import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../service/blog.service';
import { Blog } from '../_models/blog.model';
import { BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent {
  @Output() blogData = new EventEmitter();
  @Input()
  BlogNumber!: number;
  blog:Blog[]=[];
  blogLimit: number = 10
  startIndex:number=0;
  blogLength:any
  selectedCategory: string = '';
  originalBlogList:any
  @Input() showPaginator: boolean = true;
  @HostBinding('class.small-parent') isSmallParent = false;

  @HostListener('window:resize', ['$event'])

  @Output() page = new EventEmitter<PageEvent>()
  @Input() length = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = 10; //default page size
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Input() showPageSizeField = true;
  paginator$ = new BehaviorSubject<{pageIndex:number,pageSize:number}|null>({pageIndex:0,pageSize:10})
  onResize(event: Event) {
    this.checkParentSize();
  }

  constructor(private router: Router,private el: ElementRef, private blogService:BlogService, private route: ActivatedRoute){
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.selectedCategory = navigation.extras.state['category'];
      console.log(this.selectedCategory,"selectedCategory")
    }
  }

  ngOnInit() {
    this.checkParentSize();
    this.getBlogList();
    
    // Subscribe to the search term changes
    this.blogService.currentSearchTerm.subscribe(searchTerm => {
      this.filterBlogs(searchTerm);
    });
  }

  checkParentSize() {
    const parentWidth = (this.el.nativeElement as HTMLElement).parentElement?.clientWidth;
    this.isSmallParent = parentWidth ? parentWidth < 600 : false; // Example threshold
    console.log(parentWidth + 'px', this.isSmallParent);
  }

  // filterBlogsByCategory(): void {
  //   if (this.selectedCategory) {
  //     this.filteredBlog = this.blog.filter(data => data.categoryName === this.selectedCategory);
  //   } else {
  //     this.filteredBlog = this.blog; // Show all blogs if no category is selected
  //   }
  // }


  getBlogList(){
this.blogService.getBlogList(this.startIndex, this.pageSize).subscribe((response:any)=>{
  this.blog = response.data.blogs
  this.blogLength = response.data.totalBlogs
  if (this.selectedCategory) {
    console.log(this.selectedCategory,"77")
    this.blog = this.blog.filter(data => data.categoryName === this.selectedCategory);
    this.blogLength = this.blog.length
  } else {
    console.log("81")
    this.blog = this.blog; // Show all blogs if no category is selected
    this.originalBlogList = this.blog
  }
})
  }

  
  NavigateToBlockDetail(blog:any){
    console.log(blog,"blog", blog.categoryName)
    const blogTitleSlug = blog.tittle.replace(/\s+/g, '-'); 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([`blog/${blogTitleSlug}`]);
    //  this.router.navigate([`blog/blog-detail/${blog.id}`])
  }

  // changeBlogView(blog:any):void{
  //   console.log(blog,"251");
  //   this.blogData.emit(blog);
    
  // }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;  // Update current page index
    this.pageSize = event.pageSize;  // Update page size
    this.startIndex = this.pageIndex * this.pageSize;  // Calculate new startIndex
    this.getBlogList() // Fetch new items based on updated page
  }

  filterBlogs(searchTerm: string): void {
    if (!searchTerm) {
      // If searchTerm is empty, return the original list or reset it
      this.blog = [...this.originalBlogList];
      return;
    }
  
    // Filter blogs based on the search term
    this.blog = this.originalBlogList.filter((data: any) => {
      const term = searchTerm.toLowerCase();
      
      // Use optional chaining and default to empty string if property is undefined or null
      const title = (data.tittle || '').toLowerCase();
      // const author = (data.author || '').toLowerCase();
      // const categoryName = (data.categoryName || '').toLowerCase();
      
      return title.includes(term);
    });
  }
  
}
