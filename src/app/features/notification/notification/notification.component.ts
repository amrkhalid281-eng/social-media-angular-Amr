import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { INotification } from '../../../core/models/i-notification.interface';
import { NotificationService } from '../../../shared/services/notification.service';
import { InfiniteScrollDirective } from '../../../shared/directives/infinite-scroll';


@Component({
  selector: 'app-notification',
  imports: [RouterLink, InfiniteScrollDirective],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent implements OnInit {
  private readonly notificationsService = inject(NotificationService);

  notifications = signal<INotification[]>([]);
  onlyUnread = signal(false); // false = "All" tab, true = "Unread" tab
  loading = signal(false);
  done = signal(false);
  markingId = signal<string | null>(null); // the notification being marked as read
  markingAll = signal(false);

  // counts only the notifications that are already loaded
  unreadCount = computed(() => this.notifications().filter((n) => !n.isRead).length);

  private currentPage = 0;
  private totalPages = 1;
  private requestId = 0; // used to ignore the answer of an old request after switching tabs
  private readonly myId: string | null =
    JSON.parse(localStorage.getItem('socialUser') ?? 'null')?._id ?? null;

  defaultPhoto =
    'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png';

  ngOnInit(): void {
    this.loadNotifications();
  }

  // ---------- loading ----------

  setFilter(unread: boolean): void {
    if (this.onlyUnread() === unread) return;

    this.onlyUnread.set(unread);
    this.requestId++; // any request still running becomes "stale"
    this.notifications.set([]);
    this.currentPage = 0;
    this.totalPages = 1;
    this.done.set(false);
    this.loading.set(false);
    this.loadNotifications();
  }

  loadNotifications(): void {
    const next = this.currentPage + 1;
    if (this.loading() || next > this.totalPages) return;

    const id = this.requestId;
    this.loading.set(true);

    // one API for both tabs: only the "unread" param changes
    this.notificationsService.getNotifications(next, this.onlyUnread()).subscribe({
      next: (res) => {
        if (id !== this.requestId) return; // the user switched tabs meanwhile
        console.log(res); // check the real keys here
        this.loading.set(false);
        this.notifications.update((old) => [...old, ...res.data.notifications]);
        this.currentPage = res.meta.pagination.currentPage;
        this.totalPages = res.meta.pagination.numberOfPages;
        this.done.set(this.currentPage >= this.totalPages);
      },
      error: (err) => {
        console.log(err);
        if (id === this.requestId) this.loading.set(false);
      },
    });
  }

  // ---------- mark as read ----------

  markAsRead(n: INotification): void {
    if (this.markingId()) return;
    this.markingId.set(n._id);

    this.notificationsService.markAsRead(n._id).subscribe({
      next: () => {
        this.notifications.update((list) =>
          this.onlyUnread()
            ? list.filter((x) => x._id !== n._id) // Unread tab: it disappears
            : list.map((x) => (x._id === n._id ? { ...x, isRead: true } : x)),
        );
        this.markingId.set(null);
      },
      error: (err) => {
        console.log(err);
        this.markingId.set(null);
      },
    });
  }

  markAllAsRead(): void {
    if (this.markingAll() || this.unreadCount() === 0) return;
    this.markingAll.set(true);

    this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.update((list) =>
          this.onlyUnread() ? [] : list.map((x) => ({ ...x, isRead: true })),
        );
        this.markingAll.set(false);
      },
      error: (err) => {
        console.log(err);
        this.markingAll.set(false);
      },
    });
  }

  // ---------- helpers used by the template ----------

  // adjust the "type" values to the real ones from the API
  text(n: INotification): string {
    switch (n.type) {
      case 'follow_user':
        return 'started following you';
      case 'like_post':
        return 'liked your post';
      case 'comment_post':
        return 'commented on your post';
      case 'share_post':
        return 'shared your post';
      default:
        return n.message ?? 'sent you a notification';
    }
  }

  // the small round icon on the avatar
  icon(n: INotification): { name: string; color: string } {
    switch (n.type) {
      case 'like_post':
        return { name: 'favorite', color: 'text-rose-500' };
      case 'comment_post':
        return { name: 'chat_bubble', color: 'text-[#1877f2]' };
      case 'share_post':
        return { name: 'repeat', color: 'text-emerald-600' };
      case 'follow_user':
        return { name: 'person_add', color: 'text-violet-600' };
      default:
        return { name: 'notifications', color: 'text-slate-500' };
    }
  }

  // the small gray line under the sentence (the post/comment text)
  preview(n: INotification): string {
    return n.entity?.body ?? n.entity?.content ?? '';
  }

  // "5m", "3h", "5d" ...
  timeAgo(date: string): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}w`;
    return new Date(date).toLocaleDateString();
  }

  // my own profile, or another user's profile
  profileLink(n: INotification): string[] | null {
    const id = n.actor?._id;
    if (!id) return null;
    return id === this.myId ? ['/profile'] : ['/profile/u-profile', id];
  }
}