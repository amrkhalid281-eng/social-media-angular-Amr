import { Component, inject, signal } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { IPosts } from '../../../core/models/i-posts.interface';
import { PostCardComponent } from '../post-card/post-card.component';
import { InfiniteScrollDirective } from '../../directives/infinite-scroll';

@Component({
  selector: 'app-community',
  imports: [PostCardComponent,InfiniteScrollDirective],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css',
})
export class CommunityComponent {
  private readonly postsService = inject(PostsService);

  myPosts = signal<IPosts[]>([]);
  loading = signal(false);
  done = signal(false);
  private currentPage = 0;
  private totalPages = 1;

  userId=signal<string | null>(JSON.parse(localStorage.getItem('socialUser') ??'null')?._id ?? null)

  ngOnInit(): void {
    this.getAllPost();
  }

  getAllPost(){
    const id = this.userId();
    const next=this.currentPage +1
    if (this.loading() || next > this.totalPages) return;

    this.loading.set(true)
    this.postsService.getAllPostes(next).subscribe({
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
