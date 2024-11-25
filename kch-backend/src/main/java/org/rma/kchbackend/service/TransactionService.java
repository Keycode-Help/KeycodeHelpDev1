package org.rma.kchbackend.service;

import org.rma.kchbackend.model.Transaction;
import org.rma.kchbackend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final KeycodeUserService keycodeUserService;
    private final EmailService emailService;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository, KeycodeUserService keycodeUserService, EmailService emailService) {
        this.transactionRepository = transactionRepository;
        this.keycodeUserService = keycodeUserService;
        this.emailService = emailService;
    }

    public List<Transaction> getPendingTransactionsByUserId(Long userId) {
        return transactionRepository.findAll().stream()
                .filter(transaction -> transaction.getKeycodeUser().getId().equals(userId) && transaction.getStatus().equals("PENDING"))
                .toList();
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public String processCheckout(Long userId) throws IOException {
        List<Transaction> pendingTransactions = getPendingTransactionsByUserId(userId);

        if (pendingTransactions.isEmpty()) {
            throw new IllegalArgumentException("No pending transactions found for user ID: " + userId);
        }

        for (Transaction transaction : pendingTransactions) {
            // Ensure the vehicle is not already processed
            if (!transaction.getStatus().equals("CHECKED_OUT")) {
                transaction.setStatus("CHECKED_OUT");
                transactionRepository.save(transaction);

                String userEmail = transaction.getKeycodeUser().getEmail();
                String adminEmail = System.getenv("SENDER_EMAIL");
                String confirmationNumber = transaction.getConfirmationNumber();

                emailService.sendEmail(userEmail, "Order Confirmation", "Thank you for your order. Your confirmation number is: " + confirmationNumber);
                emailService.sendEmail(adminEmail, "New Transaction to Process", "Order with confirmation number: " + confirmationNumber + " is ready for processing.");
            }
        }

        return "Checkout completed successfully. Confirmation email sent.";
    }

}