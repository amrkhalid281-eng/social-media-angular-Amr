import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { InfiniteScrollDirective } from '../../directives/infinite-scroll';

interface ILiker {
  _id: string;
  name: string;
  username?: string;
  photo?: string;
}

@Component({
  selector: 'app-alert-like',
  imports: [RouterLink, InfiniteScrollDirective],
  templateUrl: './alert-like.component.html',
  styleUrl: './alert-like.component.css',
  host: { '(document:keydown.escape)': 'close()' }, // Esc closes the alert
})
export class AlertLikeComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  // only the id is needed, the alert loads the likes by itself
  postId = input.required<string>();
  closed = output<void>();

  users = signal<ILiker[]>([]);
  total = signal(0);
  loading = signal(false);
  done = signal(false);
  errorMsg = signal('');

  private currentPage = 0;
  private totalPages = 1;
  private readonly myId: string | null =
    JSON.parse(localStorage.getItem('socialUser') ?? 'null')?._id ?? null;

  defaultPhoto =
    'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png';

  ngOnInit(): void {
    this.loadLikes();
  }

  close(): void {
    this.closed.emit();
  }

  // my own profile, or another user's profile
  profileLink(user: ILiker): string[] {
    return user._id === this.myId ? ['/profile'] : ['/profile/u-profile', user._id];
  }

  // loads the next page (also called by the infinite scroll inside the alert)
  loadLikes(): void {
    const next = this.currentPage + 1;
    if (this.loading() || next > this.totalPages) return;

    this.loading.set(true);
    this.errorMsg.set('');

    this.postsService.getPostLikes(this.postId(), next).subscribe({
      next: (res) => {
        console.log(res); // check the real keys here

        // the users may come as res.data.likes, and each item may be wrapped as { user: {...} }
        const raw: any[] = res.data.likes ?? res.data.users ?? [];
        const list: ILiker[] = raw.map((item) => item.user ?? item);
        this.users.update((old) => [...old, ...list]);

        const p = res.meta?.pagination;
        if (p) {
          this.total.set(p.total);
          this.currentPage = p.currentPage;
          this.totalPages = p.numberOfPages;
        } else {
          // no pagination in the response: everything arrived at once
          this.total.set(this.users().length);
          this.currentPage = 1;
          this.totalPages = 1;
        }

        this.done.set(this.currentPage >= this.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.errorMsg.set(err.error?.message ?? 'Could not load the likes.');
        this.loading.set(false);
      },
    });
  }
}