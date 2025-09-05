import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService, Me } from '../services/auth.service';
import { CartResponse, CartService } from '../services/cart.service';
import { OrderDetail, OrderService } from '../services/order.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './order.component.html',
})
export class OrderComponent implements OnInit {
  mode: 'confirm' | 'detail' = 'confirm';

  // CONFIRMATION
  me?: Me | null;
  cart?: CartResponse | null;
  loadingConfirm = false;

  // DÉTAIL
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

  // ===== Confirmation =====
  private loadConfirmData() {
    this.loadingConfirm = true;
    this.auth.getMe().subscribe({ next: (me) => (this.me = me), error: () => (this.me = null) });
    this.cartService.getCart().subscribe({
      next: (cart) => { this.cart = cart; this.loadingConfirm = false; },
      error: () => { this.cart = null; this.loadingConfirm = false; },
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

  // ===== Détail =====
  private fetchOrderDetail(id: number) {
    this.loadingDetail = true;
    this.orderService.getOrderById(id).subscribe({
      next: (o) => { this.order = o; this.loadingDetail = false; },
      error: () => { this.loadingDetail = false; },
    });
  }

  get cartTotal(): string { return this.cart?.total ?? '0.00'; }
  goEditProfile() { this.router.navigate(['/account']); } // adapte si besoin
}
