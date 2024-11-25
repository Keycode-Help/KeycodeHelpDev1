package org.rma.kchbackend.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    private final SendGrid sendGridClient;
    private final String senderEmail;

    @Autowired
    public EmailService(SendGrid sendGridClient) {
        this.sendGridClient = sendGridClient;

        // Get sender email from environment variable, fallback to a default email if not found
        this.senderEmail = System.getenv("SENDER_EMAIL");
        if (this.senderEmail == null || this.senderEmail.isEmpty()) {
            throw new RuntimeException("SENDER_EMAIL not found in environment variables.");
        }
    }

    public String sendEmail(String toEmail, String subject, String body) {
        Email from = new Email(senderEmail);
        Email to = new Email(toEmail);
        Content content = new Content("text/plain", body);
        Mail mail = new Mail(from, subject, to, content);

        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sendGridClient.api(request);

            System.out.println("Response Status Code: " + response.getStatusCode());
            System.out.println("Response Body: " + response.getBody());
            System.out.println("Response Headers: " + response.getHeaders());

            return "Email sent successfully. Status Code: " + response.getStatusCode();
        } catch (IOException ex) {
            return "Error sending email: " + ex.getMessage();
        }
    }
}