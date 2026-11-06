import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ISuggestions } from '../../core/models/i-suggestions.interface';
import { AuthservicesService } from '../../core/services/authservices.service';

@Component({
  selector: 'app-suggested-friends',
  imports: [RouterLink],
  templateUrl: './suggested-friends.component.html',
  styleUrl: './suggested-friends.component.css',
})
export class SuggestedFriendsComponent implements OnInit {
  private readonly authservicesService = inject(AuthservicesService);

  suggestionsData = signal<ISuggestions[]>([]);
  
  followedIds = signal<Set<string>>(new Set());
  followingId = signal<string | null>(null);

  loadingMore = signal(false);
  hasMore = signal(false);

  private page = 0;
  private readonly pageSize = 20;

  ngOnInit(): void {
    this.getSuggestedFriends();
  }

  getSuggestedFriends(): void {
    this.fetch(1);
  }

  loadMore(): void {
    if (this.loadingMore()) return;
    this.fetch(this.page + 1);
  }

  private fetch(page: number): void {
    this.loadingMore.set(true);

    this.authservicesService.getFollowSuggestions(this.pageSize, page).subscribe({
      next: (res) => {
        const incoming: ISuggestions[] = res.data.suggestions;

        this.suggestionsData.update((old) => {
          const ids = new Set(old.map((u) => u._id));
          return [...old, ...incoming.filter((u) => !ids.has(u._id))];
        });

        this.page = page;
        this.hasMore.set(incoming.length >= this.pageSize);
        this.loadingMore.set(false);
      },
      error: () => this.loadingMore.set(false),
    });
  }

  isFollowed(id: string): boolean {
    return this.followedIds().has(id);
  }

  toggleFollow(user: ISuggestions): void {
    if (this.followingId()) return;
    this.followingId.set(user._id);

    this.authservicesService.followUnfollow(user._id).subscribe({
      next: () => {
        this.followedIds.update((set) => {
          const next = new Set(set);
          next.has(user._id) ? next.delete(user._id) : next.add(user._id);
          return next;
        });
        this.followingId.set(null);
      },
      error: (err) => {
        // console.log(err);
        this.followingId.set(null);
      },
    });
  }


}