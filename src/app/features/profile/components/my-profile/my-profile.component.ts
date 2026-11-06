import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthservicesService } from '../../../../core/services/authservices.service';
import { IPosts } from '../../../../core/models/i-posts.interface';
import { User } from '../../../../core/models/i-user-profile.interface';
import { PostsService } from '../../../../shared/services/posts.service';
import { InfiniteScrollDirective } from '../../../../shared/directives/infinite-scroll';
import { ProfilePostCardComponent } from '../profile-post-card/profile-post-card.component';

@Component({
  selector: 'app-my-profile',
  imports: [ProfilePostCardComponent, InfiniteScrollDirective],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css',
})
export class MyProfileComponent implements OnInit {
  private readonly authservicesService = inject(AuthservicesService);
  private readonly postsService = inject(PostsService);

  private readonly myId: string | null =
    JSON.parse(localStorage.getItem('socialUser') ?? 'null')?._id ?? null;

  defaultPhoto =
    'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png';

  // ----- profile data -----
  userdata = signal<User | null>(null);
  errorMsg = signal('');

  // ----- posts list (My Posts / Saved) -----
  tab = signal<'posts' | 'saved'>('posts');
  posts = signal<IPosts[]>([]);
  loading = signal(false);
  done = signal(false);

  postsTotal = signal<number | null>(null); // total of "My Posts"
  savedTotal = signal<number | null>(null); // total of "Saved"
  // the number next to the tabs = the total of the tab that is open now
  total = computed(() => (this.tab() === 'posts' ? this.postsTotal() : this.savedTotal()) ?? 0);

  private currentPage = 0;
  private totalPages = 1;
  private requestId = 0; // used to ignore the answer of an old request after switching tabs

  ngOnInit(): void {
    this.getUserProfile();
    this.loadPosts();
    this.loadSavedTotal();
  }

  getUserProfile(): void {
    if (!this.myId) {
      this.errorMsg.set('Could not find your account. Please log in again.');
      return;
    }

    this.authservicesService.getUserProfile(this.myId).subscribe({
      next: (res) => this.userdata.set(res.data.user),
      error: (err) => {
        console.log(err);
        this.errorMsg.set(err.error?.message ?? 'Could not load your profile.');
      },
    });
  }

  // one small request just to know how many saved posts there are (shown before opening the Saved tab)
  private loadSavedTotal(): void {
    this.postsService.getSavedPosts(1).subscribe({
      next: (res) => this.savedTotal.set(res.meta.pagination.total),
      error: (err) => console.log(err),
    });
  }

  // switch between the My Posts and Saved tabs
  setTab(tab: 'posts' | 'saved'): void {
    if (this.tab() === tab) return;

    this.tab.set(tab);
    this.requestId++; // any request still running becomes "stale"
    this.posts.set([]);
    this.currentPage = 0;
    this.totalPages = 1;
    this.done.set(false);
    this.loading.set(false);
    this.loadPosts();
  }

  // loads the next page of the current tab (also called by the infinite scroll)
  loadPosts(): void {
    const next = this.currentPage + 1;
    if (this.loading() || next > this.totalPages) return;
    if (this.tab() === 'posts' && !this.myId) return;

    const id = this.requestId;
    this.loading.set(true);

    const request$ =
      this.tab() === 'posts'
        ? this.postsService.getUserPost(this.myId!, next)
        : this.postsService.getSavedPosts(next);

    request$.subscribe({
      next: (res) => {
        if (id !== this.requestId) return;
        const raw: any[] = res.data.posts ?? res.data.bookmarks ?? [];
        const list: IPosts[] = raw.map((item) => item.post ?? item);

        this.loading.set(false);
        this.posts.update((old) => [...old, ...list]);
        if (this.tab() === 'posts') this.postsTotal.set(res.meta.pagination.total);
        else this.savedTotal.set(res.meta.pagination.total);
        this.currentPage = res.meta.pagination.currentPage;
        this.totalPages = res.meta.pagination.numberOfPages;
        this.done.set(this.currentPage >= this.totalPages);
      },
      error: (err) => {
        // console.log(err);
        if (id === this.requestId) this.loading.set(false);
      },
    });
  }
}