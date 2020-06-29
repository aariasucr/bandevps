import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SegurosComponent} from './seguros/seguros.component';
import {LoginComponent} from './login/login.component';
import {RouteGuard} from './shared/route-guard';
import {RegisterUserComponent} from './register-user/register-user.component';
import {LoggedInUserRouteGuard} from './shared/logged-in-user-route-guard';
import {EditInformationComponent} from './edit-information/edit-information.component';
import {AccountsComponent} from './accounts/accounts.component';
import {CardsComponent} from './cards/cards.component';
import {FormInsurancesComponent} from './form-insurances/form-insurances.component';
import {AboutUsComponent} from './about-us/about-us.component';
import {UbicacionesComponent} from './ubicaciones/ubicaciones.component';
import {ResetPasswordRequestComponent} from './reset-password-request/reset-password-request.component';
import {AuthManagementComponent} from './auth-management/auth-management.component';
import {TransfersComponent} from './transfers/transfers.component';

export const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [RouteGuard]},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'editInformation', component: EditInformationComponent, canActivate: [RouteGuard]},
  {path: 'insurances', component: SegurosComponent, canActivate: [RouteGuard]},
  {path: 'registerUser', component: RegisterUserComponent, canActivate: [LoggedInUserRouteGuard]},
  {path: 'accounts', component: AccountsComponent, canActivate: [RouteGuard]},
  {path: 'cards', component: CardsComponent, canActivate: [RouteGuard]},
  {path: 'formInsurances', component: FormInsurancesComponent, canActivate: [RouteGuard]},
  {path: 'aboutUs', component: AboutUsComponent},
  {path: 'ubicaciones', component: UbicacionesComponent, canActivate: [RouteGuard]},
  {
    path: 'resetPassword',
    component: ResetPasswordRequestComponent,
    canActivate: [LoggedInUserRouteGuard]
  },
  {
    path: 'authManagement',
    component: AuthManagementComponent,
    canActivate: [LoggedInUserRouteGuard]
  },
  {path: 'transfers', component: TransfersComponent, canActivate: [RouteGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
