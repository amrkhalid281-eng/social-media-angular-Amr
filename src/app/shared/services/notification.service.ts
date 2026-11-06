import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly httpClient =inject(HttpClient)

  getNotifications(page=1,onlyUnread=false):Observable<any>{
    const params: Record<string, string | number | boolean> = { page, limit: 10 };
  if (onlyUnread) params['unread'] = false;

    return this.httpClient.get(`${environment.baseUrl}/notifications`,{params})
  }

  getUnreadNotifications():Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/notifications/unread-count`)
  }

  markAsRead(id:string):Observable<any>{
    return this.httpClient.patch(`${environment.baseUrl}/notifications/${id}/read`,{})
  }

  markAllAsRead():Observable<any>{
    return this.httpClient.patch(`${environment.baseUrl}/notifications/read-all`,{})
  }
}
