import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { AuthService, Me } from '../services/auth.service';
import { CartResponse, CartService } from '../services/cart.service';
import { OrderDetail, OrderService } from '../services/order.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, CurrencyPipe],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  mode: 'confirm' | 'detail' = 'confirm';

  // Confirmation
  me?: Me | null;
  cart?: CartResponse | null;
  loadingConfirm = false;

  /** Lignes prêtes pour l'affichage (types simples) */
  displayItems: { name: string; qty: number; price: number }[] = [];

  /** Total numérique prêt à afficher (pour le pipe currency) */
  cartTotalNum = 0;

  // Détail
  order?: OrderDetail | null;
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

  /** Charge infos utilisateur + panier et prépare les données d'affichage */
  private loadConfirmData() {
    this.loadingConfirm = true;

    this.auth.getMe().subscribe({
      next: (me) => (this.me = me),
      error: () => (this.me = null),
    });

    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;

        // Map des items -> types sûrs pour le template
        this.displayItems = (this.cart?.items ?? []).map((it: any) => ({
          name: String(it?.product?.name ?? ''),
          qty: Number(it?.quantity ?? 0),
          price: Number(it?.product?.price ?? 0), // nombre pour CurrencyPipe
        }));

        // Total numérique
        this.cartTotalNum = this.displayItems.reduce(
          (sum, li) => sum + li.qty * li.price,
          0
        );

        this.loadingConfirm = false;
      },
      error: () => {
        this.cart = null;
        this.displayItems = [];
        this.cartTotalNum = 0;
        this.loadingConfirm = false;
      },
    });
  }

  confirmOrder() {
    this.orderService.checkout().subscribe({
      next: (res) => {
        if (res?.id) this.router.navigate(['/order', res.id]);
        else this.router.navigate(['/my-orders']);
      },
      error: () => alert('Impossible de valider la commande pour le moment.'),
    });
  }

  /** Détail d'une commande */
  private fetchOrderDetail(id: number) {
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

  goEditProfile() {
    this.router.navigate(['/account']);
  }
}
