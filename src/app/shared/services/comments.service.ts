import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient=inject(HttpClient)

  getPostComments(postId:string,page=1):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/posts/${postId}/comments`,
      {params:{page,limit:10}}
    )
  }


  openCommentId = signal<string | null>(null);
  toggleComment(id: string): void {
    this.openCommentId.update((current) => (current === id ? null : id));
  }

  createComment(postId:string,data:FormData):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/posts/${postId}/comments`,data)
  }

  createRebly(postId:string,commentId:string):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/posts/${postId}/comments/${commentId}/replies`,{})
  }


  getCommentReblise(postId:string,commentId:string,page=1):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/posts/${postId}/comments/${commentId}/replies`,
      {params:{page,limit:10}})
  }

  deleteComment(postId:string,commentId:string):Observable<any>{
    return this.httpClient.delete(`${environment.baseUrl}/posts/${postId}/comments/${commentId}`)
  }

  likeUnlikeComment(postId:string,commentId:string):Observable<any>{
    return this.httpClient.put(`${environment.baseUrl}/posts/${postId}/comments/${commentId}/like`,{})
  }

}
