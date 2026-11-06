import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthservicesService } from '../../../core/services/authservices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  login:WritableSignal<string>=signal('Log In')

  private readonly authservices=inject(AuthservicesService)
  private readonly router=inject(Router)

  loginForm:FormGroup= new FormGroup({
    email: new FormControl('', [Validators.required,Validators.email,]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
    ]),
  },{updateOn:'submit'})

  loginSubmit(){
    if(this.loginForm.valid){
      this.login.set('Please Wait...')
      this.authservices.signIn(this.loginForm.value).subscribe({
        next:(res)=>{
          // console.log(res);
          localStorage.setItem('socialToken',res.data.token)
          localStorage.setItem('socialUser',JSON.stringify(res.data.user))
          this.login.set('Log In')
          this.router.navigate(['/feeds'])
        },
        error:(err)=>{
          // console.log(err);
          this.login.set('Log In')
        }
      })
    }else {
      this.loginForm.markAllAsTouched();
    }
  }
}
