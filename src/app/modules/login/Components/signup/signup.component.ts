import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Inject, inject, Output, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { ServicesDetailService } from '../../../services/service/services-detail.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  // @Output() handleNavigationSignup = new EventEmitter<'login'>()
  @Output() handleNavigationSignup = new EventEmitter()
  passwordType: string = 'password';
  selectedCountry!: string ; 
  // countries: any;
  selectedCountryFlag: any;
  signup: FormGroup;
  keyChar: any;
  // countries: any;
   countries: any[] = [];
   private apiUrl = 'https://restcountries.com/v3.1/all';
   readonly dialogRef = inject(MatDialogRef<SignupComponent>);
   isBrowser!: boolean;
  constructor(
    private fb: FormBuilder,
    private http:HttpClient,
    private cdr:ChangeDetectorRef,
    private auth:AuthService,
    private router:Router,
    private toaster:ToastrService,
    @Inject(PLATFORM_ID) platformId: Object,
    private service:ServicesDetailService,
    private toastr:ToastrService
  ) {

    this.isBrowser = isPlatformBrowser(platformId);

    console.log("Signup")
    this.signup = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
          ),
        ],
      ],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(14),
        // Validators.pattern('^[A-Z](?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,14}$')
        // Validators.pattern('^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,14}$')
        Validators.pattern('^[A-Z](?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{7,14}$')
      ]],
      firstName: ['',[Validators.required,Validators.maxLength(50),
        Validators.pattern('^[A-Za-z ]+$')]],
      lastName: ['',[Validators.required,Validators.maxLength(50),
        Validators.pattern('^[A-Za-z ]+$')]],
      contactNumber : ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]],
      // country: [this.selectedCountry],
      selectedCountry: [this.selectedCountry],
    });
  }

  getCountries(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  ngOnInit(){
    this.getCountries().subscribe((data) => {
      this.countries = data.map((country: any) => ({
        name: country.name.common,
        code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
        flag: country.flags.svg
      }));
      // Sort countries alphabetically by name
    this.countries.sort((a, b) => a.name.localeCompare(b.name));
      this.signup?.get("selectedCountry")?.setValue(this.countries.find(d=> d.name == "India"));
    });
  }

  togglePassword(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  handleNavigation(){
    console.log('login signup')
    this.handleNavigationSignup.emit('login')
  }

  onCountryChange(selectedCountry: any) {
    console.log(selectedCountry,"selectedCountry")
    if (selectedCountry) {
      this.selectedCountryFlag = selectedCountry.flag;
      this.signup?.get("selectedCountry")?.setValue(this.selectedCountry);
      this.signup?.get("selectedCountry")?.updateValueAndValidity();
      
    } else {
      this.selectedCountryFlag = null;
    }
   
  }
  
  noSpace(event: any) {
    if (event.keyCode === 32 && !event.target.value) return false;
    return true;
  }

  onSubmit() {
    if(this.isBrowser){
    console.log(this.signup.value);
    this.signup?.markAllAsTouched();
    if(this.signup?.invalid)return;
  
    if (this.signup.valid) {
      // Handle successful form submission
      console.log('Form Submitted!', this.signup.value);
  
      const registerValue = {
        firstName: this.signup.value.firstName,
        lastName: this.signup.value.lastName,
        email: this.signup.value.email,
        mobileNumber: this.signup.value.selectedCountry.code + this.signup.value.contactNumber,
        password: this.signup.value.password
      };
  
      // Call the register method from AuthService
      this.auth.register(registerValue).subscribe(
        (response: any) => {
  
          if (response.success) {

              localStorage?.setItem('userEmail',response?.data?.email);
              const cartItems = JSON.parse(localStorage.getItem('myCartItem')!)?.filter((item:any)=>!item?.cartUpdated);
           
              const payload = cartItems?.map((item:any) => ({
                itemId: item.itemid || 0,
                id: item.itemid,
                itemName: item.itemName || item.specication || 'Unknown Item',
                itemRate: Number(item.rate?.replace(/[^\d.-]/g, "")) || 0,
                price: Number(item.rate?.replace(/[^\d.-]/g, "")) || 0,
                quantity: item.quantity,
                userId: Number(response.data.userId) || 0,
                processStatus: '',
                discountPercent: 0,
                discountAmount: 0,
                tax: item.tax || 0,
                image: item.imagepath || ''
              }));
              
              this.updateCartDetails('myCartItem')
              console.log("163")
          
              // Assuming `addCartItem` accepts an array
              this.service.addCartItem(payload).subscribe((res: any) => {
                console.log(res, "149");
              });
              localStorage.setItem("token",response.data.token)
              localStorage.setItem("userId",response.data.userId)
              this.auth.updateLoginStatus(true);
              // this.toastr.success('Successfully Login')
              this.dialogRef.close();
            


            this.toaster.success('Registration successful!');
            localStorage.setItem("token",response.data.token);
            localStorage.setItem("userId",response.data.userId)
            this.auth.updateLoginStatus(true);
            this.dialogRef.close(); 
          } 
        },
        (error: any) => {
          console.error('Registration error', error);
          this.toaster.error(error?.error?.message);
        }
      );
    } else {
      // Handle form errors
      console.log('Form is invalid');
    }
  }
  }
  
   // closeLogin
   closeDialog(): void {
    console.log("CloseLogin")
    this.dialogRef.close(); // This will close the dialog
  }

  // Prevent leading whitespace
  preventLeadingWhitespace(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value;
    // Prevent a space if the input is empty or has only leading whitespace
    if (event.key === ' ' && input.trim().length === 0) {
      event.preventDefault();
    }
  }

  updateCartDetails (storageKey: string){
    console.log("206", storageKey)
    const items = JSON.parse(localStorage[storageKey] || '[]');
    localStorage[storageKey] = JSON.stringify(
        items.map((d:any)=> ({...d, cartUpdated: true}))
    )
  }
}
