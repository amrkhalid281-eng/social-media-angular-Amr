import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthservicesService } from '../../../../core/services/authservices.service';
import { ISuggestions } from '../../../../core/models/i-suggestions.interface';

@Component({
  selector: 'app-right-side',
  imports: [RouterLink],
  templateUrl: './right-side.component.html',
  styleUrl: './right-side.component.css',
})
export class RightSideComponent implements OnInit {
  private readonly authservicesService=inject(AuthservicesService)

  suggestionsData=signal<ISuggestions[]>([])
  isOpen=signal<boolean>(false)
  followingId = signal<string | null>(null);

  ngOnInit(): void {
    this.getSuggestedFriends()
  }

  toggel(){
    this.isOpen.update((v)=>!v)
  }

  getSuggestedFriends(){
    this.authservicesService.getFollowSuggestions(5).subscribe({
      next:(res)=>{
        this.suggestionsData.set(res.data.suggestions)
      },
      error:(err)=>{}
    })
  }

  follow(user: ISuggestions): void {
    if (this.followingId()) return;
    this.followingId.set(user._id);

    this.authservicesService.followUnfollow(user._id).subscribe({
      next: () => {
        this.suggestionsData.update((list) => list.filter((u) => u._id !== user._id));
        this.followingId.set(null);
      },
      error: (err) => {
        console.log(err);
        this.followingId.set(null);
      },
    });
  }
}
