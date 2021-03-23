import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SettingsGuard implements CanActivate {
  constructor(private router: Router, private route: ActivatedRoute) { }

  //grab request parameters and give them to the Settings components
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      this.router.navigate(['/dashboard/Settings'], { relativeTo: this.route, state: route.queryParams});
      return true;
  }
}
