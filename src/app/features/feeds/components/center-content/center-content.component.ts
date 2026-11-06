import { formatDate } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {RouterOutlet} from '@angular/router';
import { PostsService } from '../../../../shared/services/posts.service';

@Component({
  selector: 'app-center-content',
  imports: [RouterOutlet,ReactiveFormsModule],
  templateUrl: './center-content.component.html',
  styleUrl: './center-content.component.css',
})
export class CenterContentComponent {

  private readonly postsService=inject(PostsService)

  imgFile!:File
  imgUrl=signal<string|ArrayBuffer|null|undefined>('')
  postBody:FormControl=new FormControl()
  postPrivacy:FormControl=new FormControl('public')

  get canPost(): boolean {
    return !!this.postBody.value?.trim() || !!this.imgFile;
  }

  removeImage(input:HTMLInputElement){
    this.imgFile=null!
    this.imgUrl.set(null)
    input.value=''
  }

  holdImage(e:Event){
    let imageFile = e.target as HTMLInputElement
    if(imageFile.files && imageFile.files.length>0){
      this.imgFile = imageFile.files[0]
      this.readFile()
    }
  }

  readFile(){
    let fileReader = new FileReader()
    fileReader.readAsDataURL(this.imgFile)
    fileReader.onload= (e) =>{
      this.imgUrl.set(e.target?.result)
    }
  }

  createPost(e:SubmitEvent, form:HTMLFormElement){
    e.preventDefault()
    if (!this.canPost) return;
    
    let formData =new FormData()
    if(this.postBody){
      formData.append('body',this.postBody.value)
    }
    if(this.postPrivacy){
      formData.append('privacy',this.postPrivacy.value)
    }
    if(this.imgFile){
      formData.append('image',this.imgFile)
    }

    this.postsService.createPosts(formData).subscribe({
      next:(res)=>{
        form.reset()
        this.imgUrl.set(null)
        this.postsService.homeFeedPosts()
      },
      error:(err)=>{
        
      }
    })
  }
}

