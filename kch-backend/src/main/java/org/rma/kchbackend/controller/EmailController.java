package org.rma.kchbackend.controller;

import org.rma.kchbackend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class EmailController {

    private final EmailService emailService;

    @Autowired
    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/send-email")
    public String sendEmail(@RequestParam String toEmail, @RequestParam String subject, @RequestParam String body) throws IOException {
        return emailService.sendEmail(toEmail, subject, body);
    }
}