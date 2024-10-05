import { Component, ElementRef, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EmployeeService } from '../../services/employee.service';
import { MessageService } from 'primeng/api';
import { CommonModule, DatePipe } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-bulk-invoice',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    MessagesModule,
    ToastModule,
    TableModule,
    DatePipe
  ],
  templateUrl: './bulk-invoice.component.html',
  styleUrl: './bulk-invoice.component.css',
  providers: [MessageService],
})
export class BulkInvoiceComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  fileName: string = 'No file chosen';
  uploadLabel: string = 'Choose CSV File';
  validationMessage: string = '';
  validHeaders: string[] = [
    'dueDate',
    'periodStartDate',
    'periodEndDate',
    'tariff',
    'unitsConsumed',
    'customerId',
  ];
  message: any = [];

  constructor(
    private messageService: MessageService,
    private bulkAddService: EmployeeService
  ) {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileName = file.name;
      this.validateCsvHeaders(file);
    }
  }

  validateCsvHeaders(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;
      const headers = content
        .split('\n')[0]
        .split(',')
        .map((header) => header.trim());

      const missingHeaders = this.validHeaders.filter(
        (header) => !headers.includes(header)
      );
      const extraHeaders = headers.filter(
        (header) => !this.validHeaders.includes(header)
      );

      if (missingHeaders.length === 0 && extraHeaders.length === 0) {
        this.validationMessage = '';
        this.showToastMessage(
          'info',
          'Upload Started',
          'CSV file is being uploaded...'
        );
        this.simulateUpload();
      } else {
        this.validationMessage = 'Invalid CSV headers. ';
        if (missingHeaders.length > 0) {
          this.validationMessage += `Missing: ${missingHeaders.join(', ')}. `;
          console.log('one');
        }
        if (extraHeaders.length > 0) {
          this.validationMessage += `Extra: ${extraHeaders.join(', ')}. `;
          console.log('two');
        }
        this.resetFileInput();
        this.showToastMessage(
          'error',
          'Uploading Failed',
          this.validationMessage
        );
      }
      this.parseCsvData(content);
    };
    reader.readAsText(file);
  }

  simulateUpload(): void {
    let progress = 100;
    this.showToastMessage(
      'success',
      'Submitted',
      `Progress: ${Math.round(progress)}%`
    );
  }

  resetFileInput(): void {
    this.fileInput.nativeElement.value = '';
    this.fileName = 'No file chosen';
  }

  showToastMessage(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }

  addToDB() {
    const file = this.fileInput.nativeElement.files?.[0];

    // Check if the file exists and is valid
    if (!file) {
      this.messageService.add({
        severity: 'error',
        summary: 'No File Selected',
        detail: 'Please select a CSV file first.',
      });
      return;
    }

    this.bulkAddService.postBulkCsvInv(file).subscribe({
      next: (response) => {
        if (
          response.startsWith('Unexpected') ||
          response.startsWith('Duplicate') ||
          response.startsWith('Validation')
        ) {
          this.message = [
            { severity: 'error', summary: 'Unknown error', detail: response },
          ];
        } else {
          this.message = [
            {
              severity: 'success',
              summary: 'Customers Added',
              detail: response,
            },
          ];
        }
        this.resetFileInput();
      },
      error: (err) => {
        console.error('Full error object: ', err);
        this.message = [
          {
            severity: 'error',
            detail: err.message || err.error || 'Unknown error',
          },
        ];
        this.resetFileInput();
      },
    });
  }

  csvData: any[] = [];
  parseCsvData(content: string): void {
    const lines = content.split('\n').slice(1); // Skip the header line
    this.csvData = lines
      .filter((line) => line.trim() !== '') // Filter out empty lines
      .map((line) => {
        const values = line.split(',').map((value) => value.trim());
        return {
          dueDate: values[0],
          periodStartDate: values[1],
          periodEndDate: values[2],
          tariff: values[3],
          unitsConsumed: values[4],
          customerId: values[5],
        };
      });
  }
}
