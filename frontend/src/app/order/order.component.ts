// src/app/order/order.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, Me } from '../services/auth.service';
import { CartResponse, CartService } from '../services/cart.service';
import { OrderDetail, OrderService } from '../services/order.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  mode: 'confirm' | 'detail' = 'confirm';

  // ===== CONFIRMATION =====
  me?: Me | null;
  cart?: CartResponse | null;
  cartTotalNum: number = 0;
  loadingConfirm = false;

  // ===== DÉTAIL =====
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

  // ===== Charger données confirmation =====
  private loadConfirmData() {
    this.loadingConfirm = true;

    this.auth.getMe().subscribe({
      next: (me) => (this.me = me),
      error: () => (this.me = null),
    });

    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;

        // 🔎 Debug JSON panier
        console.log('🧺 cart in /order:', this.cart);

        // ✅ Calcul du total côté front
        this.cartTotalNum = (this.cart?.items ?? []).reduce((sum: number, it: any) => {
          const price = Number(it?.product?.price ?? 0);
          const qty = Number(it?.quantity ?? 0);
          return sum + price * qty;
        }, 0);

        this.loadingConfirm = false;
      },
      error: () => {
        this.cart = null;
        this.cartTotalNum = 0;
        this.loadingConfirm = false;
      },
    });
  }

  confirmOrder() {
    this.orderService.checkout().subscribe({
      next: (res) => {
        if (res?.id) {
          this.router.navigate(['/order', res.id]);
        } else {
          this.router.navigate(['/my-orders']);
        }
      },
      error: () => alert('Impossible de valider la commande pour le moment.'),
    });
  }

  // ===== Charger détail commande =====
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

  // ===== Navigation =====
  goEditProfile() {
    this.router.navigate(['/account']);
  }
}
