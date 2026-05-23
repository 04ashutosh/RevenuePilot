import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AiService } from '../../../core/services/ai.service';

@Component({
  selector: 'app-email-draft-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="modal-container">
      <h2 mat-dialog-title>⚡ AI Invoicing Assistant</h2>
      
      <mat-dialog-content class="modal-content">
        <div *ngIf="isLoading" class="loader-container">
          <div class="spinner"></div>
          <p>Drafting payment reminder email using Ollama...</p>
        </div>

        <div *ngIf="errorMessage" class="error-container">
          <span>⚠️</span> {{ errorMessage }}
        </div>

        <div *ngIf="!isLoading && !errorMessage" class="draft-box">
          <p class="section-label">Generated Draft Email:</p>
          <pre class="email-text">{{ emailBody }}</pre>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions class="modal-actions" *ngIf="!isLoading">
        <button type="button" class="btn btn-secondary" mat-dialog-close>Close</button>
        <button *ngIf="!errorMessage" type="button" class="btn btn-primary" (click)="copyToClipboard()">
          {{ isCopied ? 'Copied! ✓' : 'Copy to Clipboard' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .modal-container { padding: 24px; font-family: 'Inter', sans-serif; min-width: 480px; max-width: 600px; }
    h2 { margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: #1e1b4b; display: flex; align-items: center; gap: 8px; }
    .modal-content { display: flex; flex-direction: column; gap: 16px; overflow: visible; }
    .loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 0; gap: 16px; color: #64748b; }
    .spinner { width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-container { background: #fee2e2; color: #991b1b; padding: 14px; border-radius: 8px; font-size: 14px; font-weight: 500; }
    .draft-box { display: flex; flex-direction: column; gap: 8px; }
    .section-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; }
    .email-text { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 14px; color: #0f172a; line-height: 1.5; white-space: pre-wrap; font-family: 'Inter', sans-serif; max-height: 350px; overflow-y: auto; }
    .modal-actions { margin-top: 24px; display: flex; justify-content: flex-end; gap: 12px; }
    .btn { padding: 10px 18px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: background 0.15s ease; }
    .btn-secondary { background: #f1f5f9; color: #475569; }
    .btn-secondary:hover { background: #e2e8f0; }
    .btn-primary { background: #6366f1; color: white; }
    .btn-primary:hover { background: #4f46e5; }
  `]
})
export class EmailDraftModalComponent implements OnInit {
  isLoading = true;
  emailBody = '';
  errorMessage = '';
  isCopied = false;

  constructor(
    private aiService: AiService,
    private dialogRef: MatDialogRef<EmailDraftModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { invoiceId: string }
  ) {}

  ngOnInit(): void {
    this.aiService.generateInvoiceEmail(this.data.invoiceId).subscribe({
      next: (res) => {
        this.emailBody = res.email;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not generate email draft. Ensure local Ollama is started on port 11434.';
        this.isLoading = false;
      }
    });
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.emailBody);
    this.isCopied = true;
    setTimeout(() => this.isCopied = false, 2000);
  }
}