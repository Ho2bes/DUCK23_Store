import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Ajout de FormsModule

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // ✅ Ajout ici aussi
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  product: any;
  productId!: number;
  quantity: number = 1; // 🔥 Ajout d’un champ quantité

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(this.productId).subscribe(data => {
      this.product = data;
    });
  }

  /** Ajouter le produit au panier */
  addToCart(): void {
    if (this.product && this.quantity > 0) {
      this.cartService.addToCart(this.product.id, this.quantity).subscribe(() => {
        alert(`${this.quantity} x ${this.product.name} ajouté au panier !`);
      });
    }
  }
}
