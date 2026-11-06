import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IPosts } from '../../../core/models/i-posts.interface';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-alert-edited',
  imports: [ReactiveFormsModule],
  templateUrl: './alert-edited.component.html',
  styleUrl: './alert-edited.component.css',
})
export class AlertEditedComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  post = input.required<IPosts>();

  closed = output<void>();

  bodyCtrl = new FormControl('');
  newImgFile: File | null = null;
  newImgUrl = signal<string>('');
  loading = signal(false);
  errorMsg = signal('');

  ngOnInit(): void {
    this.bodyCtrl.setValue(this.post().body ?? '');
  }

  get canSave(): boolean {
    const text = this.bodyCtrl.value?.trim() ?? '';
    const hasContent = !!text || !!this.post().image || !!this.newImgFile;
    const changed = text !== (this.post().body ?? '').trim() || !!this.newImgFile;
    return hasContent && changed;
  }

  holdImage(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.newImgFile = input.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(this.newImgFile)
      reader.onload = () => this.newImgUrl.set(reader.result as string);
    }
  }

  removeNewImage(input: HTMLInputElement): void {
    this.newImgFile = null;
    this.newImgUrl.set('');
    input.value = '';
  }

  close(): void {
    if (this.loading()) return;
    this.closed.emit();
  }

  update(): void {
    if (!this.canSave || this.loading()) return;

    const formData = new FormData();
    formData.append('body', this.bodyCtrl.value?.trim() ?? '')
    if (this.newImgFile) formData.append('image', this.newImgFile)

    this.loading.set(true);
    this.errorMsg.set('');

    this.postsService.updatePost(this.post()._id, formData).subscribe({
      next: () => {
        this.loading.set(false)
        this.postsService.homeFeedPosts()
        this.closed.emit()
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message ?? 'Something went wrong, please try again.');
        this.loading.set(false)
      },
    });
  }
}
