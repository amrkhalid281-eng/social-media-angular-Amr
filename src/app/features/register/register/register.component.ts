import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthservicesService } from '../../../core/services/authservices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

  msgError:WritableSignal<string>=signal('')
  loading:WritableSignal<boolean>=signal(false)

  private readonly authservices=inject(AuthservicesService)
  private readonly router=inject(Router)

  registerForm:FormGroup= new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[A-Z][a-z]{2,}(?:\s[a-z]{3,}){0,4}$/i),
    ]),
    username: new FormControl('', Validators.pattern(/^[a-z0-9_]{3,15}$/i)),
    email: new FormControl('', [Validators.required,Validators.email,]),
    gender: new FormControl('', [Validators.required,Validators.pattern(/^(male|female)$/)]),
    dateOfBirth: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
    ]),
    rePassword: new FormControl('', [
      Validators.required,
    ]),
  },{validators:this.comfirmPass})

  comfirmPass(x:AbstractControl){
    return x.get('password')?.value===x.get('rePassword')?.value ?null:{missmatch:true}
  }

  registerSubmit(){

    
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true)
    this.msgError.set('');
    console.log(this.registerForm.value);
    this.authservices.signUp(this.registerForm.value).subscribe({
      next:(res)=>{
        // console.log(res);
        this.loading.set(false)
        this.router.navigate(['/login'])
      },
      error:(err)=>{
        // console.log(err);
        this.msgError.set(err.error?.message);
        this.loading.set(false)
      },
    })
  }
}
