import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

// on crée un composant Angular pour gérer le panier de l'utilisateur, y compris le chargement des articles, la mise à jour des quantités, la suppression d'articles et le calcul du total.
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule], // on importe forms et common pour les fonctionnalités de formulaire et les directives Angular
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: any[] = [];

  constructor(private cartService: CartService, private router: Router) {}
  // on injecte le service CartService pour gérer les opérations liées au panier et le Router pour la navigation
  // on utilise loadCart pour charger les articles du panier lors de l'initialisation du composant

  ngOnInit(): void {
    this.loadCart();
  }

  /** 🔄 Charger le panier */
  loadCart(): void {
    this.cartService.getCart().subscribe(data => {
      this.cart = data.items || []; // on initialise le tableau cart avec les articles récupérés du service
    });
  }

  /** ✏️ Mettre à jour la quantité */
  updateQuantity(cartItemId: number, quantity: number): void {
    this.cartService.updateCartItem(cartItemId, quantity).subscribe(() => {
      this.loadCart(); // on recharge le panier après la mise à jour
    });
  }

  /** ❌ Supprimer un article du panier */
remove(productId: number) {
  this.cartService.removeCartItem(productId).subscribe({
    next: () => this.loadCart(), // on recharge le panier après la suppression
    error: (e) => console.error(e),
  });
}

  /** 🏷️ Calculer le total */
  // on calcule le total du panier en sommant le prix de chaque article multiplié par sa quantité
  getTotal(): number {
    return this.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }


goToOrder() {
  this.router.navigate(['/order']);        // confirmation (sans id) on crée une nouvelle commande
}

goToMyOrders() {
  this.router.navigate(['/my-orders']);    // historique on va voir les commandes passées
}
}
