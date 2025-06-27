import { Routes, provideRouter } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { AccountHomeComponent } from './account-home/account-home.component';
import { authGuard } from './auth.guard';
import { CartComponent } from './cart/cart.component';
import { ProductsComponent } from './products/products.component';

/*
  Définition des routes de l'application Angular.
  Chaque route est associée à un composant spécifique et peut être protégée par un guard d'authentification.
  Les routes publiques sont accessibles sans authentification, tandis que les routes protégées nécessitent une connexion.
*/

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'account-home', component: AccountHomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Routes protégées
  { path: 'account', component: AccountComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },

  // Route publique
  { path: 'products/:id', component: ProductsComponent },

  // Route de redirection par défaut
  { path: '**', redirectTo: '' }
];

export const appRouting = provideRouter(appRoutes); 
