import { Component } from '@angular/core';
import { LeftSideComponent } from '../components/left-side/left-side.component';
import { CenterContentComponent } from '../components/center-content/center-content.component';
import { RightSideComponent } from '../components/right-side/right-side.component';

@Component({
  selector: 'app-feeds',
  imports: [LeftSideComponent, CenterContentComponent, RightSideComponent],
  templateUrl: './feeds.component.html',
  styleUrl: './feeds.component.css',
})
export class FeedsComponent {}
