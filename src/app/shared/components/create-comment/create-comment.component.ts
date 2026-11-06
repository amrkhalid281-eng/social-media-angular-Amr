import { Component, inject, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-create-comment',
  imports: [ReactiveFormsModule],
  templateUrl: './create-comment.component.html',
  styleUrl: './create-comment.component.css',
})
export class CreateCommentComponent {
  private readonly commentsService=inject(CommentsService)

  postId = input.required<string>();
  imgFile!:File
  imgUrl=signal<string|ArrayBuffer|null|undefined>('')
  commentContent:FormControl=new FormControl()
  loading=signal<boolean>(false)
  created=output<void>()


  get canPost(): boolean {
    return !!this.commentContent.value?.trim() || !!this.imgFile;
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

  createComment(e:SubmitEvent,form:HTMLFormElement){
    e.preventDefault()
    if (!this.canPost) return

    let formData =new FormData()
    if(this.commentContent){
      formData.append('content',this.commentContent.value)
    }
    if(this.imgFile){
      formData.append('image',this.imgFile)
    }

    this.loading.set(true)
    this.commentsService.createComment(this.postId(),formData).subscribe({
      next:(res)=>{
        console.log(res);
        form.reset()
        this.imgUrl.set(null)
        this.created.emit()
        this.loading.set(false)
      },
      error:(err)=>{
        console.log(err);
        this.loading.set(false)
      }
    })
  }

}
