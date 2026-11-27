package com.skyflow.server.support;

import com.skyflow.server.support.dto.TicketRequest;
import com.skyflow.server.support.dto.TicketResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
public class SupportTicketController {

    private final SupportTicketRepository ticketRepository;

    public SupportTicketController(SupportTicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @PostMapping("/tickets")
    public ResponseEntity<TicketResponse> createTicket(
            @RequestBody TicketRequest req) {
        if (req.email() == null || req.email().isBlank() ||
            req.message() == null || req.message().isBlank()) {
            return ResponseEntity.badRequest().body(
                new TicketResponse(
                    false,
                    "Email and message are required.",
                    null
                )
            );
        }

        String email = req.email().trim().toLowerCase();
        String name = (req.fullName() != null && !req.fullName().isBlank())
                ? req.fullName().trim()
                : email.split("@")[0];
        String subject = (req.subject() != null && !req.subject().isBlank())
                ? req.subject().trim()
                : "General Inquiry";

        SupportTicket saved = ticketRepository.save(
            new SupportTicket(name, email, subject, req.message().trim())
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(
            new TicketResponse(
                true,
                "Your support ticket has been registered successfully!",
                saved.getId(),
                saved.getStatus()
            )
        );
    }

    @GetMapping("/tickets")
    public ResponseEntity<Map<String, Object>> getAllTickets() {
        var tickets = ticketRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(
            Map.of("totalTickets", tickets.size(), "tickets", tickets)
        );
    }

    @GetMapping("/tickets/user/{email}")
    public ResponseEntity<List<SupportTicket>> getTicketsByUser(
            @PathVariable String email) {
        return ResponseEntity.ok(
            ticketRepository.findByEmailOrderByCreatedAtDesc(
                email.trim().toLowerCase()
            )
        );
    }
}
