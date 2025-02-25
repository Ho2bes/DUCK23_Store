import { Routes, provideRouter } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { AccountHomeComponent } from './account-home/account-home.component';
import { authGuard } from './auth.guard';
import { CartComponent } from './cart/cart.component';
import { ProductsComponent } from './products/products.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'account-home', component: AccountHomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'account', component: AccountComponent, canActivate: [authGuard] },

  { path: 'products/:id', component: ProductsComponent }, // ✅ Dynamique avec l’ID du produit
  { path: 'cart', component: CartComponent }  // ✅ Vérifie que cette route est bien là
];

export const appRouting = provideRouter(appRoutes);


/*import { Routes, provideRouter } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { AccountHomeComponent } from './account-home/account-home.component';
import { authGuard } from './auth.guard'; // 🔥 Correction ici
import { CartComponent } from './cart/cart.component';
import { ProductsComponent } from './products/products.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'account-home', component: AccountHomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'account', component: AccountComponent, canActivate: [authGuard] }, // 🔥 Correction ici


  { path: 'products/:id', component: ProductsComponent }
];

export const appRouting = provideRouter(appRoutes);*/
