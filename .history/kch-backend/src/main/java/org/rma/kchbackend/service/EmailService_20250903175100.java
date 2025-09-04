package org.rma.kchbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username:}")
    private String fromEmail;

    public String sendEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
            return "Email sent successfully to " + toEmail;
        } catch (Exception e) {
            return "Error sending email: " + e.getMessage();
        }
    }

    public String sendNotificationEmail(String firstName, String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
            return "Notification email sent successfully to " + toEmail;
        } catch (Exception e) {
            return "Error sending notification email: " + e.getMessage();
        }
    }

    /**
     * Send HTML email for better formatting
     */
    public String sendHtmlEmail(String toEmail, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true indicates HTML
            
            mailSender.send(message);
            return "HTML email sent successfully to " + toEmail;
        } catch (MessagingException e) {
            return "Error sending HTML email: " + e.getMessage();
        }
    }

    /**
     * Send keycode request notification email with HTML formatting
     */
    public String sendKeycodeRequestEmail(String toEmail, String customerName, String vehicleInfo, String status) {
        try {
            String subject = "Keycode Request " + status.substring(0, 1).toUpperCase() + status.substring(1) + " - Keycode Help";
            String htmlBody = buildKeycodeRequestHtmlEmail(customerName, vehicleInfo, status);
            
            return sendHtmlEmail(toEmail, subject, htmlBody);
        } catch (Exception e) {
            return "Error sending keycode request email: " + e.getMessage();
        }
    }

    /**
     * Build HTML email body for keycode requests
     */
    private String buildKeycodeRequestHtmlEmail(String customerName, String vehicleInfo, String status) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Keycode Request %s</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px; }
                    .content { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .vehicle-info { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #667eea; }
                    .status { display: inline-block; background: #28a745; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
                    .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
                    .button { display: inline-block; background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔑 Keycode Help</h1>
                        <p>Your keycode request has been %s!</p>
                    </div>
                    
                    <div class="content">
                        <h2>Hello %s,</h2>
                        
                        <p>Thank you for choosing Keycode Help! Your keycode request has been %s successfully.</p>
                        
                        <div class="vehicle-info">
                            <h3>Vehicle Information:</h3>
                            <p><strong>%s</strong></p>
                            <p>Status: <span class="status">%s</span></p>
                        </div>
                        
                        <h3>What happens next?</h3>
                        <ul>
                            <li>Our team will review your request and documentation</li>
                            <li>We'll process your keycode request</li>
                            <li>You'll receive updates via email and SMS (if provided)</li>
                            <li>Your keycode will be available in your account when ready</li>
                        </ul>
                        
                        <p>If you have any questions, please don't hesitate to contact our support team.</p>
                        
                        <p>Thank you for your business!</p>
                        
                        <p>Best regards,<br>The Keycode Help Team</p>
                    </div>
                    
                    <div class="footer">
                        <p>This is an automated message. Please do not reply to this email.</p>
                        <p>&copy; 2024 Keycode Help. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """, status.toUpperCase(), status, customerName, status, vehicleInfo, status.toUpperCase());
    }
}