import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthservicesService } from '../../../core/services/authservices.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkWithHref,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit{
  
  private readonly authservices=inject(AuthservicesService)
  private readonly notificationService=inject(NotificationService)

  countNotification=signal<number>(0)

  ngOnInit(): void {
    this.unreadCount()
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  navbarLogout(){
    this.authservices.logOut()
  }

  unreadCount(){
    this.notificationService.getUnreadNotifications().subscribe({
      next:(res)=>{this.countNotification.set(res.data.unreadCount)
      },
      error:()=>{}
    })
  }
}
