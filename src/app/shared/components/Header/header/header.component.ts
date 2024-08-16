import { Component, inject } from '@angular/core';
import { LoginComponent } from '../../../../modules/login/Components/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
declare var bootstrap: any;  
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly dialog = inject(MatDialog)
  constructor(private route:Router) {}
  ngAfterViewInit() {
    // Initialize Bootstrap components manually if needed
    var myCollapse = document.getElementById('navbarNav');
    var bsCollapse = new bootstrap.Collapse(myCollapse, {
      toggle: false
    });
  }

  openDialog(): void {
    console.log("hhhhhh")
    this.dialog.open(LoginComponent, {
      width: '450',
      // disableClose: true
    });
  }

  goToMyCart(){
  this.route.navigate(['cart'])
  }
}
