import { Component } from '@angular/core';

@Component({
  selector: 'app-main-hero',
  imports: [],
  templateUrl: './main-hero.component.html',
  styleUrl: './main-hero.component.css',
})
export class MainHeroComponent {
  stats = [
    { value: '2012', label: 'Founded' },
    { value: '40K+', label: 'Graduates' },
    { value: '50+', label: 'Partner Companies' },
    { value: '5', label: 'Branches' },
    { value: '20', label: 'Diplomas Available' },
  ];
}
