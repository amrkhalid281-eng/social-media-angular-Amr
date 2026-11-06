import { Component, inject, signal } from '@angular/core';
import { PostCardComponent } from '../post-card/post-card.component';
import { PostsService } from '../../services/posts.service';
import { IPosts } from '../../../core/models/i-posts.interface';
import { InfiniteScrollDirective } from '../../directives/infinite-scroll';

@Component({
  selector: 'app-saved',
  imports: [PostCardComponent,InfiniteScrollDirective],
  templateUrl: './saved.component.html',
  styleUrl: './saved.component.css',
})
export class SavedComponent {
  private readonly postsService = inject(PostsService);

  myPosts = signal<IPosts[]>([]);
  loading = signal(false);
  done = signal(false);
  private currentPage = 0;
  private totalPages = 1;


  loadSavedPosts() {
    const next = this.currentPage + 1;
    if (this.loading() || next > this.totalPages) return;

    this.loading.set(true);
    this.postsService.getSavedPosts(next).subscribe({
      next: (res) => {
        // console.log(res);
        this.myPosts.update((old) => [...old, ...res.data.bookmarks]);
        this.currentPage = res.meta.pagination.currentPage;
        this.totalPages = res.meta.pagination.numberOfPages;
        this.done.set(this.currentPage >= this.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  removeFromSaved(id: string) {
    this.myPosts.update((list) => list.filter((p) => p._id !== id));
  }

}
