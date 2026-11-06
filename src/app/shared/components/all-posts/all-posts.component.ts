import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { PostCardComponent } from '../post-card/post-card.component';

@Component({
  selector: 'app-all-posts',
  imports: [PostCardComponent],
  templateUrl: './all-posts.component.html',
  styleUrl: './all-posts.component.css',
})
export class AllPostsComponent implements OnInit{
  private readonly postsService=inject(PostsService)

  feedPosts = this.postsService.feedPosts;

  ngOnInit(): void {
    this.postsService.homeFeedPosts()
  }

}
