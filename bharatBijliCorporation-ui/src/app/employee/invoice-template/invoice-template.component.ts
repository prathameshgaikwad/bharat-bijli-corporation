import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-invoice-template',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './invoice-template.component.html',
  styleUrl: './invoice-template.component.css'
})
export class InvoiceTemplateComponent {

}
