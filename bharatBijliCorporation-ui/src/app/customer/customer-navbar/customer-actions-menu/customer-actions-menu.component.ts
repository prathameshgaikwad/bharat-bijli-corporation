import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-actions-menu',
  standalone: true,
  imports: [AvatarModule, ButtonModule, RouterModule],
  templateUrl: './customer-actions-menu.component.html',
  styleUrl: './customer-actions-menu.component.css',
})
export class CustomerActionsMenuComponent {
  balance: number = 1203.9;
  username: string = 'Prathamesh';
}
