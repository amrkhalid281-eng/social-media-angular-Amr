import { Component, inject, OnInit, signal } from '@angular/core';
import { PostCardComponent } from '../post-card/post-card.component';
import { PostsService } from '../../services/posts.service';
import { IPosts } from '../../../core/models/i-posts.interface';
import { InfiniteScrollDirective } from '../../directives/infinite-scroll';

@Component({
  selector: 'app-my-posts',
  imports: [PostCardComponent,InfiniteScrollDirective],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.css',
})
export class MyPostsComponent implements OnInit{
  private readonly postsService = inject(PostsService);

  myPosts = signal<IPosts[]>([]);
  loading = signal(false);
  done = signal(false);
  private currentPage = 0;
  private totalPages = 1;

  userId=signal<string | null>(JSON.parse(localStorage.getItem('socialUser') ??'null')?._id ?? null)

  ngOnInit(): void {
    this.getUserPost();
  }

  getUserPost(){
    const id = this.userId();
    const next=this.currentPage +1
    if (!id) return;
    if (this.loading() || next > this.totalPages) return;

    this.loading.set(true)
    this.postsService.getUserPost(id,next).subscribe({
      next:(res)=>{
        // console.log(res);
        this.myPosts.update((old)=>[...old,...res.data.posts])
        this.currentPage = res.meta.pagination.currentPage
        this.totalPages = res.meta.pagination.numberOfPages
        this.done.set(this.currentPage >= this.totalPages)
        this.loading.set(false)
      },
      error:(err)=>{
        // console.log(err);
        this.loading.set(false)
      }
    })
  }

}
