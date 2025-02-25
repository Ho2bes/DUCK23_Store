import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Ajout des modules nécessaires
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: any[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  /** 🔄 Charger le panier */
  loadCart(): void {
    this.cartService.getCart().subscribe(data => {
      this.cart = data.items || [];
    });
  }

  /** ✏️ Mettre à jour la quantité */
  updateQuantity(cartItemId: number, quantity: number): void {
    this.cartService.updateCartItem(cartItemId, quantity).subscribe(() => {
      this.loadCart();
    });
  }

  /** ❌ Supprimer un article du panier */
  removeItem(cartItemId: number): void {
    this.cartService.removeCartItem(cartItemId).subscribe(() => {
      this.loadCart();
    });
  }

  /** 🏷️ Calculer le total */
  getTotal(): number {
    return this.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }
}
