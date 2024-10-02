import { Component } from '@angular/core';
import { UploadComponent } from '../upload/upload.component';

@Component({
  selector: 'app-add-cust',
  standalone: true,
  imports: [UploadComponent],
  templateUrl: './add-cust.component.html',
  styleUrl: './add-cust.component.css'
})
export class AddCustComponent {

}
