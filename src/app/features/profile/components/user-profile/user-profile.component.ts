import { Location } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPosts } from '../../../../core/models/i-posts.interface';
import { User } from '../../../../core/models/i-user-profile.interface';
import { AuthservicesService } from '../../../../core/services/authservices.service';
import { PostCardComponent } from '../../../../shared/components/post-card/post-card.component';
import { PostsService } from '../../../../shared/services/posts.service';
import { InfiniteScrollDirective } from '../../../../shared/directives/infinite-scroll';

@Component({
  selector: 'app-user-profile',
  imports: [PostCardComponent, InfiniteScrollDirective],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly postsService = inject(PostsService);
  private readonly authservicesService = inject(AuthservicesService);

  private readonly myId: string | null =
    JSON.parse(localStorage.getItem('socialUser') ?? 'null')?._id ?? null;

  defaultPhoto =
    'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png';

  // ----- the user (header) -----
  id = signal('');
  user = signal<User | null>(null); // null until the data arrives
  loading = signal(true);
  errorMsg = signal('');

  following = signal(false);
  followLoading = signal(false);

  // the cover image over a dark layer (like the original page). null = the default gradient stays
  coverStyle = computed(() => {
    // TODO: add "cover" to the User interface and remove the "as any"
    const cover = (this.user() as any)?.cover;
    return cover
      ? `linear-gradient(rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.35)), url("${cover}")`
      : null;
  });

  // ----- the user's posts -----
  posts = signal<IPosts[]>([]);
  postsLoading = signal(false);
  postsDone = signal(false);

  private currentPage = 0;
  private totalPages = 1;
  private requestId = 0; // ignores old answers when the user opens another profile

  ngOnInit(): void {
    // paramMap emits again if the :id changes while this page stays on screen
    this.route.paramMap.subscribe((p) => {
      const id = p.get('id')!;

      // my own profile has its own page
      if (id === this.myId) {
        this.router.navigate(['/profile'], { replaceUrl: true });
        return;
      }

      this.id.set(id);
      this.requestId++;

      // start from zero for the new user
      this.posts.set([]);
      this.currentPage = 0;
      this.totalPages = 1;
      this.postsDone.set(false);
      this.postsLoading.set(false);

      this.getData();
      this.loadPosts();
    });
  }

  goBack(): void {
    this.location.back();
  }

  // ---------- header ----------

  getData(): void {
    const requestId = this.requestId;
    this.loading.set(true);
    this.errorMsg.set('');
    this.user.set(null);

    this.authservicesService.getUserProfile(this.id()).subscribe({
      next: (res) => {
        if (requestId !== this.requestId) return;
        console.log(res); // check the real keys here (cover, isFollowing ...)
        this.user.set(res.data.user);
        this.following.set(!!res.data.user?.isFollowing); // the field name is a guess
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        if (requestId !== this.requestId) return;
        this.errorMsg.set(err.error?.message ?? 'Could not load this profile.');
        this.loading.set(false);
      },
    });
  }

  toggleFollow(): void {
    if (this.followLoading()) return;
    this.followLoading.set(true);

    this.authservicesService.followUnfollow(this.id()).subscribe({
      next: () => {
        this.following.update((v) => !v);
        this.followLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.followLoading.set(false);
      },
    });
  }

  // ---------- posts (also called by the infinite scroll) ----------

  loadPosts(): void {
    const next = this.currentPage + 1;
    if (this.postsLoading() || next > this.totalPages) return;

    const requestId = this.requestId;
    this.postsLoading.set(true);

    this.postsService.getUserPost(this.id(), next).subscribe({
      next: (res) => {
        if (requestId !== this.requestId) return; // another profile was opened meanwhile
        this.postsLoading.set(false);
        this.posts.update((old) => [...old, ...res.data.posts]);
        this.currentPage = res.meta.pagination.currentPage;
        this.totalPages = res.meta.pagination.numberOfPages;
        this.postsDone.set(this.currentPage >= this.totalPages);
      },
      error: (err) => {
        console.log(err);
        if (requestId === this.requestId) this.postsLoading.set(false);
      },
    });
  }
}