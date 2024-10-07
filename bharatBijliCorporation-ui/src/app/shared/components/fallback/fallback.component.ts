import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fallback',
  standalone: true,
  imports: [],
  templateUrl: './fallback.component.html',
  styleUrl: './fallback.component.css',
})
export class FallbackComponent {
  @Input() message: string = 'No Data';
}
