package org.rma.kchbackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BrevoEmailService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${BREVO_API_KEY:}")
    private String brevoApiKey;

    @Value("${BREVO_API_URL:https://api.brevo.com/v3/smtp/email}")
    private String brevoApiUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean sendEmail(String toEmail, String subject, String htmlContent, String fromName, String fromEmail) {
        try {
            System.out.println("📧 BrevoEmailService: Sending email via Brevo API");
            System.out.println("   To: " + toEmail);
            System.out.println("   Subject: " + subject);
            System.out.println("   From: " + fromName + " <" + fromEmail + ">");

            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);
            headers.set("accept", "application/json");

            // Create email payload
            Map<String, Object> emailData = new HashMap<>();
            
            // Sender
            Map<String, String> sender = new HashMap<>();
            sender.put("name", fromName);
            sender.put("email", fromEmail);
            emailData.put("sender", sender);

            // Recipients
            Map<String, String> recipient = new HashMap<>();
            recipient.put("email", toEmail);
            emailData.put("to", List.of(recipient));

            // Content
            emailData.put("subject", subject);
            emailData.put("htmlContent", htmlContent);

            // Create HTTP entity
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(emailData, headers);

            System.out.println("🔧 API Configuration:");
            System.out.println("   URL: " + brevoApiUrl);
            System.out.println("   API Key: " + (brevoApiKey != null && brevoApiKey.length() > 10 ? 
                brevoApiKey.substring(0, 10) + "..." : "NOT SET"));

            // Send request
            ResponseEntity<String> response = restTemplate.exchange(
                brevoApiUrl, 
                HttpMethod.POST, 
                entity, 
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("✅ Email sent successfully via Brevo API!");
                System.out.println("   Response: " + response.getBody());
                return true;
            } else {
                System.err.println("❌ Failed to send email. Status: " + response.getStatusCode());
                System.err.println("   Response: " + response.getBody());
                return false;
            }

        } catch (Exception e) {
            System.err.println("❌ Failed to send email via Brevo API: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public boolean sendPasswordResetEmail(String toEmail, String resetUrl, String token) {
        String subject = "Password Reset Request - Keycode Help";
        String htmlContent = String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">Password Reset Request</h2>
                    
                    <p>You have requested a password reset for your Keycode Help account.</p>
                    
                    <p>Click the button below to reset your password:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s?token=%s" 
                           style="background-color: #2563eb; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">
                        Or copy and paste this link in your browser:<br>
                        <a href="%s?token=%s">%s?token=%s</a>
                    </p>
                    
                    <p style="color: #666; font-size: 14px;">
                        This link will expire in 24 hours.
                    </p>
                    
                    <p style="color: #666; font-size: 14px;">
                        If you didn't request this reset, please ignore this email.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <p style="color: #999; font-size: 12px;">
                        Best regards,<br>
                        Keycode Help Team
                    </p>
                </div>
            </body>
            </html>
            """, resetUrl, token, resetUrl, token, resetUrl, token);

        return sendEmail(toEmail, subject, htmlContent, "Keycode Help", "5epmgllc@gmail.com");
    }
}
