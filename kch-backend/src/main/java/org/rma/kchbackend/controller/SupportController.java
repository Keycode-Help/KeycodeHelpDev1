package org.rma.kchbackend.controller;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/support")
@Validated
public class SupportController {

    private final JavaMailSender mailSender;

    @Value("${support.to.email:${BREVO_USERNAME:}}")
    private String supportToEmail;

    @Value("${support.from.email:${BREVO_USERNAME:}}")
    private String supportFromEmail;

    public SupportController(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public record SupportRequest(
            @NotBlank String name,
            @Email @NotBlank String email,
            @NotBlank String subject,
            @NotBlank String message
    ) {}

    @PostMapping("/contact")
    public ResponseEntity<?> contact(@RequestBody @Validated SupportRequest req) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(supportToEmail);
        msg.setFrom(supportFromEmail);
        msg.setReplyTo(req.email());
        msg.setSubject("[KCH Support] " + req.subject());
        msg.setText("From: " + req.name() + " <" + req.email() + ">\n\n" + req.message());
        mailSender.send(msg);
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "ok");
        return ResponseEntity.ok(resp);
    }
}


