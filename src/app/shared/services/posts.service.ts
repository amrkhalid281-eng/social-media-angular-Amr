import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IPosts } from '../../core/models/i-posts.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  
  feedPosts = signal<IPosts[]>([]);

  private readonly httpClient=inject(HttpClient)

  getAllPostes(page=1):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/posts`,
      {params:{page,limit:40}}
    )
  }

  getHomeFeed():Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/posts/feed`)
  }

  homeFeedPosts(): void {
    this.getHomeFeed().subscribe({
      next: (res) => this.feedPosts.set(res.data.posts),
      error: (err) => console.log(err),
    });
  }

  createPosts(data:FormData):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/posts`,data)
  }

  getSinglePost(postId:string):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/posts/${postId}`)
  }

  getUserPost(postId:string,page=1):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/users/${postId}/posts`,
      {params:{page,limit:10}},
    )
  }

  deletePost(postId:string):Observable<any>{
    return this.httpClient.delete(`${environment.baseUrl}/posts/${postId}`)
  }

  sharePost(postId: string, text: string):Observable<any> {
    const body =text?.trim();
    return this.httpClient.post(`${environment.baseUrl}/posts/${postId}/share`,
      body ? { body }:{}
    );
  }

  likeUnlikePost(postId:string):Observable<any>{
    return this.httpClient.put(`${environment.baseUrl}/posts/${postId}/like`,null)
  }

  bookmarkUnbookmarkPosts(postId:string):Observable<any>{
    return this.httpClient.put(`${environment.baseUrl}/posts/${postId}/bookmark`,null)
  }

  getSavedPosts(page=1):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/users/bookmarks`,
      {params:{page, limit:10}}
    )
  }

  updatePost(postId: string, formData: FormData):Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/posts/${postId}`, formData);
  }

  getPostLikes(postId:string,page=1):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/posts/${postId}/likes`,
      {params:{page,limit:20}}
    )
  }

}
