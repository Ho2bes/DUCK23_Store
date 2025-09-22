import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, Me } from '../services/auth.service';
import { OrderDetail, OrderService } from '../services/order.service';
import { CartService } from '../services/cart.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/* on crée un composant Angular pour gérer la confirmation et le détail des commandes.*/

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  mode: string = 'confirm';

  // ===== CONFIRMATION ===== on gère la confirmation de commande, y compris le chargement du profil utilisateur et du panier.
  me: Me | null = null;
  cartItems: any[] = [];
  loadingConfirm = false;

  // ===== DÉTAIL ===== on gère l'affichage du détail d'une commande spécifique.
  order: OrderDetail | null = null;
  loadingDetail = false;

  // ===== Services & Init ===== on injecte les services nécessaires pour l'authentification, le panier et les commandes.
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private cartService: CartService,
    private orderService: OrderService
  ) {}

  // on initialise le composant en déterminant le mode (confirmation ou détail) en fonction de la présence d'un ID dans l'URL.
  // on charge les données appropriées en fonction du mode.
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mode = 'detail';
      this.fetchOrderDetail(Number(id));
    } else {
      this.mode = 'confirm';
      this.loadConfirmData();
    }
  }

  // Charge les données pour la confirmation (profil + panier)
  // on utilise forkJoin pour charger simultanément les informations utilisateur et le panier.
  // on gère les erreurs en renvoyant des valeurs par défaut si une requête échoue.
  private loadConfirmData(): void {
    this.loadingConfirm = true;
    forkJoin({
      me: this.auth.getMe().pipe(catchError(() => of(null))),
      cart: this.cartService.getCart().pipe(catchError(() => of({ items: [] }))),
    }).subscribe({
      next: ({ me, cart }: any) => {
        this.me = me;
        // copie EXACTE de la structure du Cart
        this.cartItems = cart?.items || [];
        this.loadingConfirm = false;
      },
      error: () => {
        this.loadingConfirm = false;
      },
    });
  }

  // Recharger le panier uniquement (après maj quantité/suppression)
  // on recharge le panier en appelant le service CartService et en mettant à jour les éléments du panier.
  private reloadCart(): void {
    this.cartService.getCart().subscribe((data: any) => {
      this.cartItems = data?.items || [];
    });
  }

  // Mettre à jour la quantité — passer le productId comme dans Cart
  // on met à jour la quantité d'un article dans le panier en appelant le service CartService.
  // on s'assure que la quantité est au moins 1 avant de faire la mise à jour.
  updateQuantity(productId: number, quantity: number): void {
    const q = Math.max(1, Number(quantity) || 1);
    this.cartService.updateCartItem(productId, q).subscribe(() => this.reloadCart());
  }

  //Supprimer une ligne — passer le productId comme dans Cart
  // on supprime un article du panier en appelant le service CartService et en rechargeant le panier après la suppression.
  remove(productId: number): void {
    this.cartService.removeCartItem(productId).subscribe(() => this.reloadCart());
  }

  //Calculer le total — identique au Cart
  // on calcule le total du panier en sommant les prix des articles multipliés par leurs quantités.
  getTotal(): number {
    return (this.cartItems || []).reduce(
      (acc: number, item: any) => acc + (item.product.price * item.quantity),
      0
    );
  }

  // Valider la commande (checkout)
  // on valide la commande en appelant le service OrderService.
  // en cas de succès, on navigue vers la page de détail de la commande ou vers l'historique des commandes.
  // en cas d'erreur, on affiche une alerte.
  confirmOrder(): void {
    this.orderService.checkout().subscribe({
      next: (res: any) => {
        if (res?.id) {
          this.router.navigate(['/order', res.id]); // page détail
        } else {
          this.router.navigate(['/my-orders']);
        }
      },
      error: () => alert('Impossible de valider la commande pour le moment.'),
    });
  }

  //Charger le détail d’une commande
  // on charge le détail d'une commande spécifique en appelant le service OrderService avec l'ID de la commande.
  // on gère le chargement et les erreurs.
  private fetchOrderDetail(id: number): void {
    this.loadingDetail = true;
    this.orderService.getOrderById(id).subscribe({
      next: (o) => {
        this.order = o;
        this.loadingDetail = false;
      },
      error: () => {
        this.loadingDetail = false;
      },
    });
  }

  // ===== Helpers d’affichage pour le mode détail =====

  /** Prix unitaire résilient (accepte price_amount ou price, string/number) */
  // on obtient le prix unitaire d'un article, en gérant les différents formats possibles.
  unitPrice(it: any): number {
    if (!it || !it.product) return 0;
    const v = (it.product as any).price_amount ?? (it.product as any).price ?? 0;
    const n = typeof v === 'string' ? parseFloat(v) : Number(v);
    return isNaN(n) ? 0 : n;
  }

  /** Sous-total résilient (item.price_amount si dispo, sinon unit * qty) */
  // on calcule le sous-total d'un article, en utilisant price_amount si disponible, sinon en multipliant le prix unitaire par la quantité.
  lineTotal(it: any): number {
    if (!it) return 0;
    const v = (it as any).price_amount;
    if (v !== undefined && v !== null) {
      const n = typeof v === 'string' ? parseFloat(v) : Number(v);
      if (!isNaN(n)) return n;
    }
    const q = Number((it as any).quantity) || 0;
    return this.unitPrice(it) * q;
  }

  // ===== Navigation ===== on gère la navigation vers différentes pages (confirmation, historique, profil).
  // ces méthodes sont utilisées pour naviguer vers les pages correspondantes en utilisant le routeur Angular.
  goToOrder(): void {
    this.router.navigate(['/order']); // confirmation (sans id)
  }

  goToMyOrders(): void {
    this.router.navigate(['/my-orders']); // historique
  }

  goEditProfile(): void {
    this.router.navigate(['/account']);
  }
}
