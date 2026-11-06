import { Routes } from '@angular/router';
import { MainlayoutComponent } from './layouts/mainlayout/mainlayout.component';
import { RegisterComponent } from './features/register/register/register.component';
import { LoginComponent } from './features/login/login/login.component';
import { AuthlayoutComponent } from './layouts/authlayout/authlayout.component';
import { NotFoundComponent } from './features/notFound/not-found/not-found.component';
import { authGuard } from './core/guards/auth-guard';
import { alreadyLoggedGuard } from './core/guards/already-logged-guard';
import { AllPostsComponent } from './shared/components/all-posts/all-posts.component';
import { MyPostsComponent } from './shared/components/my-posts/my-posts.component';
import { CommunityComponent } from './shared/components/community/community.component';
import { SavedComponent } from './shared/components/saved/saved.component';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'',canActivate:[alreadyLoggedGuard],component:AuthlayoutComponent,children:[
        {path:'login',component:LoginComponent,title:'Sign In | Route Posts'},
        {path:'register',component:RegisterComponent,title:'Create Account | Route Posts'},
    ]},
    {path:'',canActivate:[authGuard],component:MainlayoutComponent,children:[
        {path:'feeds',loadComponent:()=>import('./features/feeds/feeds/feeds.component').then((c)=>c.FeedsComponent),title:'Feeds | Route Post',
            children:[
                { path: '', redirectTo: 'feed', pathMatch: 'full' },
                {path:'feed',component:AllPostsComponent},
                {path:'my-post',component:MyPostsComponent},
                {path:'community',component:CommunityComponent},
                {path:'saved',component:SavedComponent}
            ]},
        {path:'profile',loadComponent:()=>import('./features/profile/profile/profile.component').then((c)=>c.ProfileComponent),title:'profile | Route Post',
            children:[
                {path:'',redirectTo:'m-profile',pathMatch:'full'},
                {path:'m-profile',loadComponent:()=>import('./features/profile/components/my-profile/my-profile.component').then((c)=>c.MyProfileComponent)},
                {path:'u-profile/:id',loadComponent:()=>import('./features/profile/components/user-profile/user-profile.component').then((c)=>c.UserProfileComponent)}
            ]
        },
        {path:'p-details/:id',loadComponent:()=>import('./shared/components/post-details/post-details.component').then((c)=>c.PostDetailsComponent),title:'Post Details | Route Posts'},
        {path:'notification',loadComponent:()=>import('./features/notification/notification/notification.component').then((c)=>c.NotificationComponent),title:'Notification | Route posts'},
        {path:'sugg-friends',loadComponent:()=>import('./features/suggested-friends/suggested-friends.component').then((c)=>c.SuggestedFriendsComponent),title:'Suggested Friends | Route posts'},
    ]},
    {path:'**',component:NotFoundComponent,title:'error'}
];
