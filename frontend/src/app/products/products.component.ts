import { Component, OnInit } from '@angular/core'; // ✅ Import de Component et OnInit pour créer un composant
import { ActivatedRoute } from '@angular/router'; // ✅ Import de ActivatedRoute pour obtenir l'ID du produit
import { ProductService } from '../services/product.service'; // ✅ Import de ProductService pour gérer les produits
import { CartService } from '../services/cart.service'; //  ✅ Import de CartService pour gérer le panier
import { CommonModule } from '@angular/common'; // ✅ Import de CommonModule pour gérer les directives
import { RouterModule } from '@angular/router'; // ✅ Import de RouterModule pour gérer les routes
import { FormsModule } from '@angular/forms'; // ✅ Ajout de FormsModule pour gérer les formulaires

@Component({// ✅ Définition du composant 'ProductsComponent'
  selector: 'app-product',// ✅ Nom du sélecteur du composant
  standalone: true, // ✅ Définition du composant en tant que composant autonome
  imports: [CommonModule, RouterModule, FormsModule], // ✅ Import des modules nécessaires
  templateUrl: './products.component.html', // ✅ Chemin vers le fichier HTML du composant
  styleUrls: ['./products.component.scss'] // ✅ Chemin vers le fichier SCSS du composant
})
export class ProductsComponent implements OnInit { // on init sert à initialiser le composant
  product: any;
  productId!: number;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute, // Un service pour obtenir des informations sur la route actuelle
    private productService: ProductService, // Un service pour obtenir des informations sur les produits
    private cartService: CartService // Un service pour gérer le panier
  ) {}

    // ngOnInit est une fonction spéciale qui est appelée quand le composant est initialisé
  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id')); // ✅ Récupère l'ID du produit dans l'URL
    this.productService.getProductById(this.productId).subscribe(data => { // ✅ Appelle la méthode 'getProductById' du service 'ProductService'
      this.product = data; // ✅ Stocke les informations du produit dans la variable 'product'
    });
  }

  /** Ajouter le produit au panier */
  addToCart(): void {
    if (this.product && this.quantity > 0) { // ✅ Vérifie que le produit et la quantité sont valides
      this.cartService.addToCart(this.product.id, this.quantity).subscribe(() => {// ✅ Appelle la méthode 'addToCart' du service 'CartService'
        alert(`${this.quantity} x ${this.product.name} ajouté au panier !`); // ✅ Affiche une alerte pour confirmer l'ajout au panier
      });
    }
  }
}

