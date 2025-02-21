import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { FormsModule } from '@angular/forms'; // ✅ Import de FormsModule pour ngModel

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Ajout de FormsModule ici
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: any = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  /** Charger le panier */
  loadCart(): void {
    this.cartService.getCart().subscribe(data => {
      this.cart = data.items;
    });
  }

  /** Modifier la quantité d'un produit */
  updateQuantity(cartItemId: number, newQuantity: number): void {
    this.cartService.updateCartItem(cartItemId, newQuantity).subscribe(() => {
      this.loadCart();
    });
  }

  /** Supprimer un produit du panier */
  removeItem(cartItemId: number): void {
    this.cartService.removeCartItem(cartItemId).subscribe(() => {
      this.loadCart();
    });
  }

  /** ✅ Fonction pour calculer le total */
  getTotal(): number {
    return this.cart.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);
  }
}
