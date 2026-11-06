import { Component } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-left-side',
  imports: [RouterLinkWithHref,RouterLinkActive],
  templateUrl: './left-side.component.html',
  styleUrl: './left-side.component.css',
})
export class LeftSideComponent {}
