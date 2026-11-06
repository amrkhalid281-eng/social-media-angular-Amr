import { Component, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { IComments } from '../../../core/models/i-comments.interface';
import { DatePipe } from '@angular/common';
import { CreateCommentComponent } from '../create-comment/create-comment.component';
import { AlertConfirmDialogComponent } from '../alert-confirm-dialog/alert-confirm-dialog.component';

@Component({
  selector: 'app-comment-post',
  imports: [DatePipe, CreateCommentComponent, AlertConfirmDialogComponent],
  templateUrl: './comment-post.component.html',
  styleUrl: './comment-post.component.css',
  host: { '(document:click)': 'onDocumentClick($event)' },
})
export class CommintPostComponent implements OnInit {
  private readonly commentsService=inject(CommentsService)

  postId = input.required<string>();
  commentTotal= signal(0)
  commentData= signal<IComments[]>([])
  loading = signal(false);
  isOpen=signal(false)
  menuWrap = viewChild<ElementRef<HTMLElement>>('menuWrap');
  hasMore = signal(false);
  private currentPage = 0;
  private totalPages = 1;

  ngOnInit(): void {
    this.getPostComment()
  }

  getPostComment(){
    const next =this.currentPage + 1
    if (this.loading() || next > this.totalPages) return;
    
    this.loading.set(true)
    this.commentsService.getPostComments(this.postId(),next).subscribe({
      next:(res)=>{
        // console.log(res);
        this.commentTotal.set(res.meta.pagination.total)
        this.commentData.update((old) => [...old, ...res.data.comments]);
        this.currentPage = res.meta.pagination.currentPage;
        this.totalPages = res.meta.pagination.numberOfPages;
        this.hasMore.set(this.currentPage < this.totalPages);
        this.loading.set(false);
        this.myUserId.set(this.myId)
      },
      error:(err)=>{
        // console.log(err);
        this.loading.set(false)
      }
    })
  }

  refreshComments(): void {
    console.log('2) refreshComments called');
    this.commentData.set([]);
    this.currentPage = 0;
    this.totalPages = 1;
    this.hasMore.set(false);
    this.getPostComment();
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

  // ? Like Comment

  private readonly myId: string | null =
  JSON.parse(localStorage.getItem('socialUser') ?? 'null')?._id ?? null;
  myUserId=signal<string | null>(null)

  likingId = signal<string | null>(null);

  isLiked(comment: IComments): boolean {
    return !!this.myId && comment.likes.includes(this.myId);
  }

  toggleLike(comment: IComments): void {
    const me = this.myId;
    if (!me || this.likingId() === comment._id) return;

    this.likingId.set(comment._id);
    this.commentsService.likeUnlikeComment(this.postId(), comment._id).subscribe({
      next: () => {
        this.commentData.update((list) =>
          list.map((c) =>
            c._id !== comment._id
              ? c
              : {
                  ...c,
                  likes: c.likes.includes(me)
                    ? c.likes.filter((id) => id !== me)
                    : [...c.likes, me],
                },
          ),
        );
        this.likingId.set(null);
      },
      error: () => this.likingId.set(null),
    });
  }


  // ? Delete Comment

  commentToDelete = signal<IComments | null>(null); 
  deletingId = signal<string | null>(null);
  
  deleteComment(comment:IComments):void{
    if (this.deletingId()) return;
    this.deletingId.set(comment._id);

    this.commentsService.deleteComment(this.postId(),comment._id).subscribe({
      next:(res)=>{
        this.commentData.update((list) => list.filter((c) => c._id !== comment._id));   // شيله من القايمة
        this.commentTotal.update((n) => Math.max(0, n - 1));                             // نقّص العدد
        this.deletingId.set(null);
        this.commentToDelete.set(null);
      },
      error:(err)=>{
        console.log(err);
        this.deletingId.set(null);
      }
    })
  }
}
