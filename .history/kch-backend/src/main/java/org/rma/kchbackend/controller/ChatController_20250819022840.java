package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.ChatMessage;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.repository.ChatMessageRepository;
import org.rma.kchbackend.service.KeycodeUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatMessageRepository chatRepo;
    private final KeycodeUserService userService;

    public ChatController(ChatMessageRepository chatRepo, KeycodeUserService userService) {
        this.chatRepo = chatRepo;
        this.userService = userService;
    }

    @GetMapping("/history")
    public ResponseEntity<?> history(Authentication auth) {
        String email = auth.getName();
        KeycodeUser user = userService.findByEmail(email).orElseThrow();
        // Only premium/trial users can access chat
        if (user.getSubscription() == null || (!user.getSubscription().isActivated() && !user.getSubscription().isTrial())) {
            return ResponseEntity.status(403).body("Chat available for premium users only");
        }
        List<ChatMessage> msgs = chatRepo.findByUserIdOrderByCreatedAtAsc(user.getId());
        return ResponseEntity.ok(msgs);
    }

    @PostMapping("/send")
    public ResponseEntity<?> send(@RequestBody SendPayload payload, Authentication auth) {
        String email = auth.getName();
        KeycodeUser user = userService.findByEmail(email).orElseThrow();
        if (user.getSubscription() == null || (!user.getSubscription().isActivated() && !user.getSubscription().isTrial())) {
            return ResponseEntity.status(403).body("Chat available for premium users only");
        }
        ChatMessage m = new ChatMessage();
        m.setUserId(user.getId());
        m.setSender("USER");
        m.setMessage(payload.message());
        chatRepo.save(m);
        return ResponseEntity.ok().build();
    }

    public record SendPayload(String message) {}
}


