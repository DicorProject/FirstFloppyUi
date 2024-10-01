import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ProfileService } from '../service/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../cart/services/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePickerDialogComponent } from '../../../shared/components/date-picker-dialog/date-picker-dialog.component';
import { ServicesDetailService } from '../../services/service/services-detail.service';
import { LoginComponent } from '../../login/Components/login/login.component';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';

interface Booking {
  orderId: string;
  date: string;
  time: string;
  serviceImage: string;
  serviceName: string;
  paymentMethod: string;
  status: string;
  total: number;
}

@Component({
  selector: 'app-my-booking',
  templateUrl: './my-booking.component.html',
  styleUrl: './my-booking.component.scss'
})
export class MyBookingComponent {
  isBrowser!: boolean;
  bookings:any;
  constructor(private profileService:ProfileService, private route: ActivatedRoute, private cartService:CartService, private router:Router, private dialog: MatDialog, private service:ServicesDetailService, private toastr:ToastrService, @Inject(PLATFORM_ID) platformId: Object){

    this.isBrowser = isPlatformBrowser(platformId);

    this.route.queryParams.subscribe(params => {
      // const paymentStatus = params['paymentStatus'];
      const orderId = params['orderId'];
      console.log(orderId)
    })
  }

ngOnInit(){
  this.updatePayment()
  this.getUserBooking();
}

getUserBooking() {
  if(this.isBrowser){
  const userId = localStorage.getItem('userId');
  // Ensure that userId is not null or undefined
  if (userId) {
    this.profileService.getUserBooking(+userId).subscribe(
      (response: any) => {
        this.bookings = response.data
        console.log(response.data, "62");
      },
      (error: any) => {
        console.error('Error fetching user bookings:', error);
      }
    );
  } else {
    console.error('User ID not found in local storage.');
  }
}
}

openDateTimePicker(booking:any): void {
  const data = booking.leadEntryId
  const dialogRef = this.dialog.open(DatePickerDialogComponent, {
    disableClose: true, // Prevent closing the dialog by clicking outside or pressing ESC
     width: '80%',
    //  data:{id:booking.leadEntryId}
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
     console.log(result,"97");
     this.updateOrder(data, result.date, result.time)
    }
  });
}

  // deleteBooking(booking: Booking): void {
  //   // Logic for deleting the booking
  //   this.bookings = this.bookings.filter((b:any) => b !== booking);
  //   console.log('Deleted booking:', booking);
  // }

  calculateTotal(booking: any): number {
    if (!booking.items || booking.items.length === 0) {
      return 0; // No items, return 0
    }
    
    // Calculate total by summing up the price of all items
    return booking.items.reduce((total: number, item: any) => total + (item.price || 0), 0);
  }
  
  updatePayment() {
    if(this.isBrowser){
      const orderId = localStorage.getItem('orderId'); // Default to empty string if orderId is null;
    const userIdString = localStorage.getItem('userId');
    const isCashOnDelivery = JSON.parse(localStorage.getItem('isCashOnDelivery') || 'false');
    
    // Handle cases where localStorage might return null
    if (!orderId || !userIdString) {
      console.error('Order ID or User ID is missing');
      return;
    }
  
    // Convert userId to a number
    const userId = Number(userIdString);
  
    // Ensure userId is a valid number
    if (isNaN(userId)) {
      console.error('User ID is invalid');
      return;
    }
  
    // Call the service method
    this.cartService.updatePaymentStatus(orderId, userId, isCashOnDelivery).subscribe(
      response => {
        this.toastr.success('order Successfully')
        localStorage.removeItem('orderId')
        localStorage.removeItem('isCashOnDelivery')
        console.log('Payment status updated successfully', response);
        this.getUserBooking();
      },
      error => {
        console.error('Error updating payment status', error);
      }
    );
  }
  }

  goToDetail(card: any) {
    console.log(card,"139")
    const itemNameDetail = card?.subCategoryName
      ?.trim()
      ?.replace(/\s+/g, '-')
      ?.toLowerCase();

    this.router.navigate(
      [`services/service-Details/${itemNameDetail}/${card?.[0]?.itemId}`]
    );
  }
  
  // Method to call delete service
  deleteBooking(item: any) {
console.log(item,"161")
    this.profileService.deleteOrder(item.leadEntryId).subscribe({
      next: () => {
        this.getUserBooking()
        console.log('Order deleted successfully');
        // Handle success (e.g., update UI or notify the user)
      },
      error: (err) => {
        console.error('Error deleting order', err);
        // Handle error (e.g., notify the user)
      }
    });
  }

  updateOrder(orderId: number, newDateTime: string, newSlot: string) {
 // Convert the newDateTime from local format to UTC format
 const localDate = new Date(newDateTime); // Assuming the format is recognized by JavaScript Date parser
  
 if (isNaN(localDate.getTime())) {
   console.error('Invalid date format');
   return;
 }

 // Convert to UTC format
 const formattedDateTime = localDate.toISOString();

    const orderData = {
      orderId: orderId,
      newDateTime: formattedDateTime,
      newSlot: newSlot
    };

    this.profileService.updateOrder(orderData).subscribe({
      next: () => {
        this.getUserBooking();
        console.log('Order updated successfully');
        // Handle success (e.g., update UI or notify the user)
      },
      error: (err) => {
        console.error('Error updating order', err);
        // Handle error (e.g., notify the user)
      }
    });
  }

  // add to cart 
reAddToCart(item:any){
  if(this.isBrowser){
  console.log(item,"214")
  if(localStorage.getItem("userId")){
   const payload = {
     itemId:item.itemid||0,
     id:0,
     itemName:item.itemName,
     itemRate:Number(item.itemRate),
     price:Number(item.price),
     quantity: 1,
     userId:Number(localStorage.getItem("userId")),
     processStatus:'',
     discountPercent: 0,
     discountAmount: 0,
     tax: 0,
     image:item.image,
   }
   this.service.addCartItem([payload]).subscribe((res:any)=>{
   if(res.success)
     this.toastr.success(res.message)
     this.router.navigate(['cart'])
   })
  }else {
   alert("Please log in before adding items to your cart.")
   this.dialog.open(LoginComponent, {
     width: '450',
     disableClose: true
   });
  }
}
 }

}
