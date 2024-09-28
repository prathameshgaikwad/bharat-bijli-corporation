import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-company-logo',
  standalone: true,
  imports: [],
  templateUrl: './company-logo.component.html',
  styleUrl: './company-logo.component.css',
})
export class CompanyLogoComponent {
  @Input({ required: true }) entityTitle: string = '';
}
