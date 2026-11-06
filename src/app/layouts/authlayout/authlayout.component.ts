import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { NavbarLoginComponent } from './components/navbar-login/navbar-login.component';
import { MainHeroComponent } from './components/main-hero/main-hero.component';

@Component({
  selector: 'app-authlayout',
  imports: [RouterOutlet, NavbarLoginComponent, MainHeroComponent],
  templateUrl: './authlayout.component.html',
  styleUrl: './authlayout.component.css',
})
export class AuthlayoutComponent {}
