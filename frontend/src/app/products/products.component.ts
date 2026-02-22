import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

/*
on crée un composant Angular pour afficher les détails d'un produit spécifique, y compris la possibilité de l'ajouter au panier avec une quantité spécifiée.
Ce composant utilise le service ProductService pour récupérer les informations du produit par son ID et le service CartService pour gérer l'ajout du produit au panier.
il utilise également ActivatedRoute pour obtenir l'ID du produit à partir de l'URL.
Le composant est autonome, ce qui signifie qu'il peut être utilisé indépendamment sans dépendre d'un module parent spécifique.
Il importe les modules CommonModule, RouterModule et FormsModule pour les fonctionnalités de base d'Angular, la navigation et la gestion des formulaires respectivement.
*/
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  product: any;
  productId!: number;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

    // ngOnInit est une fonction spéciale qui est appelée quand le composant est initialisé
  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(this.productId).subscribe(data => {
      this.product = data;
    });
  }

  // Ajouter le produit au panier
  addToCart(): void {
    if (this.product && this.quantity > 0) {
      this.cartService.addToCart(this.product.id, this.quantity).subscribe(() => {
        alert(`${this.quantity} x ${this.product.name} ajouté au panier !`);
      });
    }
  }
}

