import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ServiceDialogComponent } from './components/home/service-dialog.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [HomeComponent,ServiceDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    CarouselModule,
    FormsModule
  ]
})
export class HomeModule { }
