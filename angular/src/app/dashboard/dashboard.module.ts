import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DashboardRouting } from './dashboard.routing';

import { DashboardService } from '../dashboard/dashboard.service';

import { DashboardComponent } from './dashboard.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { SecuritySettingsComponent } from '../security-settings/security-settings.component';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { Activate2FAModal } from '../two-factor-auth/activate-2FA-modal.component';

@NgModule({
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    SecuritySettingsComponent,
    Activate2FAModal,
    UserSettingsComponent
  ],
  imports: [
    DashboardRouting,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DashboardService],
})
export class DashboardModule { }
