import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRouting } from './dashboard.routing';

import { DashboardComponent } from './dashboard.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { SecuritySettingsComponent } from '../security-settings/security-settings.component';
import { UserSettingsComponent } from '../user-settings/user-settings.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    SecuritySettingsComponent,
    UserSettingsComponent
  ],
  imports: [
    DashboardRouting,
    CommonModule
  ]
})
export class DashboardModule { }
