import { Component } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-navbar-login',
  imports: [RouterLinkWithHref, RouterLinkActive],
  templateUrl: './navbar-login.component.html',
  styleUrl: './navbar-login.component.css',
})
export class NavbarLoginComponent {}
