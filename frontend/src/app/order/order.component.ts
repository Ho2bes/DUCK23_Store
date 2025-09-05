import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, Me } from '../services/auth.service';
import { OrderDetail, OrderService } from '../services/order.service';
import { CartService } from '../services/cart.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  mode: string = 'confirm';

  // ===== CONFIRMATION =====
  me: Me | null = null;
  cartItems: any[] = [];
  loadingConfirm = false;

  // ===== DÉTAIL =====
  order: OrderDetail | null = null;
  loadingDetail = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private cartService: CartService,
    private orderService: OrderService
  ) {}

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

  /** Charge les données pour la confirmation (profil + panier) */
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

  /** Recharger le panier uniquement (après maj quantité/suppression) */
  private reloadCart(): void {
    this.cartService.getCart().subscribe((data: any) => {
      this.cartItems = data?.items || [];
    });
  }

  /** ✏️ Mettre à jour la quantité — passer le productId comme dans Cart */
  updateQuantity(productId: number, quantity: number): void {
    const q = Math.max(1, Number(quantity) || 1);
    this.cartService.updateCartItem(productId, q).subscribe(() => this.reloadCart());
  }

  /** ❌ Supprimer une ligne — passer le productId comme dans Cart */
  remove(productId: number): void {
    this.cartService.removeCartItem(productId).subscribe(() => this.reloadCart());
  }

  /** 🏷️ Calculer le total — identique au Cart */
  getTotal(): number {
    return (this.cartItems || []).reduce(
      (acc: number, item: any) => acc + (item.product.price * item.quantity),
      0
    );
  }

  /** Valider la commande (checkout) */
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

  /** Charger le détail d’une commande */
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
  unitPrice(it: any): number {
    if (!it || !it.product) return 0;
    const v = (it.product as any).price_amount ?? (it.product as any).price ?? 0;
    const n = typeof v === 'string' ? parseFloat(v) : Number(v);
    return isNaN(n) ? 0 : n;
  }

  /** Sous-total résilient (item.price_amount si dispo, sinon unit * qty) */
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

  // ===== Navigation =====
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
