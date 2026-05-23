package com.revenuepilot.revenuepilot_api.domain.ai.controller;

import com.revenuepilot.revenuepilot_api.domain.ai.service.OllamaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
public class AiController {
    private final OllamaService ollamaService;

    public AiController(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(
            @RequestParam UUID tenantId,
            @RequestParam String message) {
        String aiResponse = ollamaService.generateChatResponse(tenantId, message);
        return ResponseEntity.ok(Map.of("response", aiResponse));
    }

    @PostMapping("/invoice-email")
    public ResponseEntity<Map<String, String>> generateInvoiceEmail(
            @RequestParam UUID invoiceId) {
        String emailDraft = ollamaService.generateOverdueEmailDraft(invoiceId);
        return ResponseEntity.ok(Map.of("email", emailDraft));
    }
}