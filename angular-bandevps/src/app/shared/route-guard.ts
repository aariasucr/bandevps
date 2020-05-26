import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable()
export class RouteGuard implements CanActivate {
  constructor(private router: Router, private firebaseAuth: AngularFireAuth) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      // Revise en firebase si el usuario cambio su estado de autenticacion
      // paso de logout a logged in o inverso
      this.firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          resolve(true);
        } else {
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}
