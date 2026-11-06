import { DatePipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IPosts } from '../../../../core/models/i-posts.interface';

// A read-only post card for the profile page: only numbers, no like / comment / share actions.
@Component({
  selector: 'app-profile-post-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './profile-post-card.component.html',
  styleUrl: './profile-post-card.component.css',
  host: { '(document:keydown.escape)': 'closeImage()' },
})
export class ProfilePostCardComponent {
  post = input.required<IPosts>();

  imagePreview = signal<string | null>(null);

  private readonly myId: string | null =
    JSON.parse(localStorage.getItem('socialUser') ?? 'null')?._id ?? null;

  profileLink(): string[] {
    const id = this.post().user._id;
    return id === this.myId ? ['/profile'] : ['/profile/u-profile', id];
  }

  openImage(src: string): void {
    this.imagePreview.set(src);
  }

  closeImage(): void {
    this.imagePreview.set(null);
  }
}