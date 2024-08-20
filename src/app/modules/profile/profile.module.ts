import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from "../../shared/shared.module";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { MyBookingComponent } from './my-booking/my-booking.component';


@NgModule({
  declarations: [
    ProfileComponent,
    MyBookingComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    MatFormFieldModule,
    NgSelectModule,
    MatSelectModule
]
})
export class ProfileModule { }
