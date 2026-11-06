import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthservicesService {
  private readonly router=inject(Router)
  private readonly httpClient=inject(HttpClient)

  signUp(data:object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/users/signup` , data)
  }
  signIn(data:object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/users/signin` , data)
  }
  logOut(){
    localStorage.removeItem('socialToken')
    localStorage.removeItem('socialUser')
    this.router.navigate(['/login'])
  }

  getFollowSuggestions(limit:number,page=1):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/users/suggestions`,
      {params:{limit, page}}
    )
  }

  followUnfollow(userId: string):Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/users/${userId}/follow`, {});
  }

  getUserProfile(userId: string):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/users/${userId}/profile`)
  }

}
