import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { HttpOptions } from '../../../shared/components/common/cache';
import { CacheStorage } from  '../../../shared/components/common/cache';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  subcategoryUrl = environment.ApiBaseUrl + 'Category/SubCategories'
  ctegorySubcategoryUrl =  environment.ApiBaseUrl + 'Home/Category-with-subcategory-list';
  itemlistUrl = environment.ApiBaseUrl + 'Home/item-list';
  locationUrl = environment.ApiBaseUrl + 'Home/Locations';
  locationSearchRes: any;
  isBrowser!: boolean;
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) { 
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get locationSearchResGetter(){
    return this.locationSearchRes;
  }

  getHomeDetails(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    const httpOptions = {
      headers: headers
    };
    // const url = environment.ApiBaseUrl.concat(`Home/fetch-all-dynamic-data`);
    const url = `${environment.ApiBaseUrl}Home/fetch-all-dynamic-data?timestamp=${new Date().getTime()}`;
    return this.http.get<any>(url, httpOptions)
      .pipe(map((response:any) => {
        return response;
      }),
        catchError(error => this.handleError(error)));
  }

  getServiceList():Observable<any>{
    if(this.isBrowser){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    const httpOptions = {
      headers: headers
    };
    const url = environment.ApiBaseUrl.concat(`Service/ServicesList`);
    return this.http.get<any>(url, httpOptions)
      .pipe(map((response:any) => {
        return response;
      }),
        catchError(error => this.handleError(error)));
    }else{
      return of([])
    }
  }

  getSubCategories(categoryId: number): Observable<any> {
    const url = `${this.subcategoryUrl}/${categoryId}`;
    return this.http.get(url);
  }

  handleError(error: any): any {
    throw new Error('Method not implemented.');
  }
  getAllCategorySubcategory(): Observable<any> {
    return this.http.get<any>(this.ctegorySubcategoryUrl);
  }
  getItemlist(){
    return this.http.get<any>(this.itemlistUrl);
  }
  

  getSearchedItemList(subgroupId: number, location: string, latitude: number, longitude: number): Observable<any> {
    if(this.isBrowser){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    
    const httpOptions = { headers: headers };
  
    // Construct payload object as per the API requirements
    const payload = {
      subgroupId: subgroupId,
      location: location,
      latitude: latitude,
      longitude: longitude
    };
  
    // Make a POST request to the API with the payload
    return this.http.post<any>(environment.ApiBaseUrl.concat('Service/searchItems'), payload, httpOptions)
      .pipe(
        map((response: any) => {
          this.locationSearchRes = response.data;
          localStorage.setItem('serviceDetails', JSON.stringify(this.locationSearchRes));
          return response;
        }),
        catchError(error => this.handleError(error))
      );
    }else{
      return of([])
    }
  }
  

  locations$ = new CacheStorage('id');
  getLocation(httpOptions: HttpOptions = {}) {
    const locations$ = this.http.get<any>(this.locationUrl);
    return this.locations$.loadData(locations$, httpOptions);
  }

  private triggerLocation = new BehaviorSubject<any>(null);

  // Expose the observable for subscribing
  triggerFunction$ = this.triggerLocation.asObservable();

  // Method to trigger function calls from other components
  triggerFunction(data: any) {
    this.triggerLocation.next(data);
  }
}
