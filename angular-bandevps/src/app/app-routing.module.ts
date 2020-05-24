import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RouteGuard} from './shared/route-guard';
import {RegisterUserComponent} from './register-user/register-user.component';
import {LoggedInUserRouteGuard} from './shared/logged-in-user-route-guard';

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [RouteGuard]},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterUserComponent, canActivate: [LoggedInUserRouteGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
