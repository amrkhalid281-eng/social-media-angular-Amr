import { Component, ElementRef, inject, input, OnInit, output, signal, viewChild } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { IPosts } from '../../../core/models/i-posts.interface';
import { DatePipe } from '@angular/common';
import { CommintPostComponent } from '../comment-post/comment-post.component';
import { CommentsService } from '../../services/comments.service';
import { PostsService } from '../../services/posts.service';
import { AlertShareComponent } from '../alert-share/alert-share.component';
import { AlertEditedComponent } from '../alert-edited/alert-edited.component';
import { AlertLikeComponent } from '../alert-like/alert-like.component';

@Component({
  selector: 'app-post-card',
  imports: [RouterLinkWithHref, DatePipe, CommintPostComponent, AlertShareComponent, AlertEditedComponent,AlertLikeComponent],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
  host: { '(document:click)': 'onDocumentClick($event)' },
})
export class PostCardComponent implements OnInit{
  private readonly commentsService =inject(CommentsService)
  private readonly postsService=inject(PostsService)
  post=input.required<IPosts>()
  unsaved = output<void>();
  isSaved = signal(false);

  isOpen =signal<boolean>(false)
  showShareAlert = signal<boolean>(false);
  showEditAlert = signal<boolean>(false);
  menuWrap = viewChild<ElementRef<HTMLElement>>('menuWrap');
  openCloseComment= this.commentsService.openCommentId
  myId=signal<string | null>(JSON.parse(localStorage.getItem('socialUser') ??'null')?._id ?? null)
  imagePreview = signal<string | null>(null);
  showLikeAlert = signal<boolean>(false);
  openLikeAlert() { this.showLikeAlert.set(true); }
  closeLikeAlert() { this.showLikeAlert.set(false); }


  ngOnInit(): void {
    this.isSaved.set(!!this.post().bookmarked)
  }

  togglebutton() {
    this.isOpen.update((v) => !v);
  }

  onDocumentClick(e: MouseEvent) {
    const wrap = this.menuWrap()?.nativeElement;
    if (!wrap?.contains(e.target as Node)) {
      this.isOpen.set(false);
    }
  }

  toggel(id: string) {
    this.commentsService.toggleComment(id);
  }

  openImage(src:string) { this.imagePreview.set(src); }
  closeImage() { this.imagePreview.set(null); }
  openShareAlert() { this.showShareAlert.set(true);}
  closeShareAlert() { this.showShareAlert.set(false);}
  closeEditAlert() { this.showEditAlert.set(false); }

  deleteMyPost(id:string){
    this.postsService.deletePost(id).subscribe({
      next:(res)=>{
        // console.log(res);
        this.postsService.feedPosts.update((post)=>
          post.filter((post)=> post._id !== id)
        );
      },
      error:(err)=>{
        // console.log(this.post());
        // console.log(err);
      }
    })
  }

  toggleLike(): void {
    const post = this.post();

    this.postsService.likeUnlikePost(post._id).subscribe({
      next: () => {
        const isLiked = post.likes.includes(this.myId() ?? '');

        this.postsService.feedPosts.update((posts) =>
          posts.map((p) => {
            if (p._id !== post._id) return p;

            return {
              ...p,
              likes: isLiked
                ? p.likes.filter((id) => id !== this.myId())
                : [...p.likes, this.myId()!],
              likesCount: p.likesCount + (isLiked ? -1 : 1),
            };
          })
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  toggleSave(): void {
    this.postsService.bookmarkUnbookmarkPosts(this.post()._id).subscribe({
      next: () => {
        const nowSaved = !this.isSaved();
        this.isSaved.set(nowSaved);
        if (!nowSaved) this.unsaved.emit();
        this.isOpen.set(false);
      },
      error: (err) => console.log(err),
    });
  }

  openEditAlert() {
    this.isOpen.set(false);
    this.showEditAlert.set(true);
  }

}
