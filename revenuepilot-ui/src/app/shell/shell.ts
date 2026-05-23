import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TenantService } from "../core/services/tenant.service";
import { TenantContextService } from "../core/services/tenant-context.service";
import { AiService } from "../core/services/ai.service";
import { Tenant } from "../core/models/tenant.model";
import { FormsModule } from "@angular/forms";
import { Subscription } from "rxjs";

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './shell.html',
  styleUrl: './shell.css'
})
export class ShellComponent implements OnInit, OnDestroy {
  tenants: Tenant[] = [];
  selectedTenantId: string = '';
  
  // AI Chat properties
  isChatOpen = false;
  chatInput = '';
  chatMessages: ChatMessage[] = [];
  isAiTyping = false;

  private tenantContextSub!: Subscription;

  constructor(
    private tenantService: TenantService,
    private tenantContextService: TenantContextService,
    private aiService: AiService
  ) {}

  ngOnInit() {
    this.tenantService.getAllTenants().subscribe(tenants => {
      this.tenants = tenants;
      if (tenants.length > 0) {
        this.selectedTenantId = tenants[0].id;
        this.onTenantChange();
      }
    });

    this.tenantContextSub = this.tenantContextService.currentTenant$.subscribe(tenantId => {
      if (tenantId) {
        this.selectedTenantId = tenantId;
        // Reset chat messages for new tenant contexts
        this.chatMessages = [
          { sender: 'ai', text: 'Hello! I am RevenuePilot AI, your Virtual CFO. Ask me anything about your current MRR, overdue status, or customer trends!' }
        ];
      }
    });
  }

  ngOnDestroy() {
    if (this.tenantContextSub) this.tenantContextSub.unsubscribe();
  }

  onTenantChange() {
    this.tenantContextService.setTenantId(this.selectedTenantId);
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendChatMessage() {
    if (!this.chatInput.trim() || !this.selectedTenantId || this.isAiTyping) return;

    const userText = this.chatInput;
    this.chatMessages.push({ sender: 'user', text: userText });
    this.chatInput = '';
    this.isAiTyping = true;

    this.aiService.chat(this.selectedTenantId, userText).subscribe({
      next: (res) => {
        this.chatMessages.push({ sender: 'ai', text: res.response });
        this.isAiTyping = false;
      },
      error: () => {
        this.chatMessages.push({ sender: 'ai', text: 'Oops! Something went wrong while calling Ollama. Please check if Ollama is running.' });
        this.isAiTyping = false;
      }
    });
  }

  selectPromptChip(prompt: string) {
    this.chatInput = prompt;
    this.sendChatMessage();
  }
}