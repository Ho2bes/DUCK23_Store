import { Routes, provideRouter } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { ModifyPasswordComponent } from './modify-password/modify-password.component';
import { ModifyDetailsComponent } from './modify-details/modify-details.component';
import { authGuard } from './auth.guard'; // 🔥 Correction ici

export const appRoutes: Routes = [
  { path: '', component: AccountComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'account', component: AccountComponent, canActivate: [authGuard] }, // 🔥 Correction ici
  { path: 'modify-password', component: ModifyPasswordComponent, canActivate: [authGuard] },
  { path: 'modify-details', component: ModifyDetailsComponent, canActivate: [authGuard] },
];

export const appRouting = provideRouter(appRoutes);
