import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-customers',
  standalone: true,
  imports: [CardModule, RouterModule, RouterOutlet, ButtonModule, CommonModule],
  templateUrl: './all-customers.component.html',
  styleUrl: './all-customers.component.css',
})
export class AllCustomersComponent {
  isUp = true;
  add = false;
  view = false;
  bulk = false;
  
  eleviateUp() {
    this.isUp = this.isUp ? false : true;
  }
  
  addUp() {
    this.add = this.add ? false : true;
  }
  
  viewUp() {
    this.view = this.view ? false : true;
  }
  
  bulkUp() {
    this.bulk = this.bulk ? false : true;
  }
}
