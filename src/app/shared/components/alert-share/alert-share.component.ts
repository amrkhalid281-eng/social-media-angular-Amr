import { Component, inject, input, output, signal } from '@angular/core';
import { IPosts } from '../../../core/models/i-posts.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-alert-share',
  imports: [ReactiveFormsModule],
  templateUrl: './alert-share.component.html',
  styleUrl: './alert-share.component.css',
})
export class AlertShareComponent {
  private readonly postsService = inject(PostsService);

  // the post being shared (sent by post-card)
  post = input.required<IPosts>();

  // tells post-card to remove the alert
  closed = output<void>();

  shareText = new FormControl('');
  loading = signal(false);
  errorMsg = signal('');

  close(): void {
    if (this.loading()) return; // don't close while the request is running
    this.closed.emit();
  }

  share(): void {
    this.loading.set(true);
    this.errorMsg.set('');

    this.postsService.sharePost(this.post()._id, this.shareText.value?.trim() ?? '').subscribe({
      next: () => {
        this.loading.set(false);
        this.postsService.homeFeedPosts(); // the new shared post shows up in the feed
        this.closed.emit();
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message ?? 'Something went wrong, please try again.');
        this.loading.set(false);
      },
    });
  }
}
