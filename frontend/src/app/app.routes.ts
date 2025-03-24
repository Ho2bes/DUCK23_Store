import { Routes, provideRouter } from '@angular/router'; // ✅ Import de Routes et provideRouter pour gérer les routes
import { HomeComponent } from './home/home.component'; // ✅ Import du composant HomeComponent
import { LoginComponent } from './login/login.component'; // ✅ Import du composant LoginComponent
import { RegisterComponent } from './register/register.component'; // ✅ Import du composant RegisterComponent
import { AccountComponent } from './account/account.component'; // ✅ Import du composant AccountComponent
import { AccountHomeComponent } from './account-home/account-home.component'; // ✅ Import du composant AccountHomeComponent
import { authGuard } from './auth.guard'; // ✅ Import du garde d'authentification
import { CartComponent } from './cart/cart.component'; // ✅ Import du composant CartComponent
import { ProductsComponent } from './products/products.component'; // ✅ Import du composant ProductsComponent

// ✅ Définition des routes de l'application
export const appRoutes: Routes = [
  { path: '', component: HomeComponent }, // Route par défaut
  { path: 'account-home', component: AccountHomeComponent }, // Route protégée
  { path: 'login', component: LoginComponent }, // Route publique
  { path: 'register', component: RegisterComponent }, // Route publique

  // Routes protégées
  { path: 'account', component: AccountComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },

  // Route publique
  { path: 'products/:id', component: ProductsComponent },

  // Route de redirection par défaut
  { path: '**', redirectTo: '' }
];

export const appRouting = provideRouter(appRoutes); // ✅ Création du service de routage avec les routes définies
