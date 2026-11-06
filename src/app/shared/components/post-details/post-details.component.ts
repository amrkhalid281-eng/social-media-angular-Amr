import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { IPosts } from '../../../core/models/i-posts.interface';
import { PostCardComponent } from '../post-card/post-card.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-post-details',
  imports: [ PostCardComponent],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit{
  private readonly activatedRoute=inject(ActivatedRoute)
  private readonly postsService=inject(PostsService)
  private readonly location=inject(Location)

  postId:WritableSignal<string>=signal('')
  postData =signal<IPosts>({} as IPosts)


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      (param)=>this.postId.set(param.get('id')!)
    )
    this.getSignlePost()
  }

  goBack(): void {
    this.location.back();
  }

  getSignlePost(){
    this.postsService.getSinglePost(this.postId()).subscribe({
      next:(res)=>{
        // console.log(res.data.post);
        this.postData.set(res.data.post)
      },
      error:(err)=>{
        // console.log(err);
        
      }
    })
  }
}
