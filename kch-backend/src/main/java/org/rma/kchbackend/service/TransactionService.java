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

  

}
