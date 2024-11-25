package org.rma.kchbackend.service;

import org.rma.kchbackend.model.AdminUser;
import org.rma.kchbackend.model.Vehicle;
import org.rma.kchbackend.model.Transaction;
import org.rma.kchbackend.repository.AdminUserRepository;
import org.rma.kchbackend.repository.VehicleRepository;
import org.rma.kchbackend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final VehicleRepository vehicleRepository;
    private final TransactionRepository transactionRepository;
    private final EmailService emailService;

    @Autowired
    public AdminUserService(AdminUserRepository adminUserRepository, VehicleRepository vehicleRepository, TransactionRepository transactionRepository, EmailService emailService) {
        this.adminUserRepository = adminUserRepository;
        this.vehicleRepository = vehicleRepository;
        this.transactionRepository = transactionRepository;
        this.emailService = emailService;
    }

    public List<AdminUser> getAllAdminUsers() {
        return adminUserRepository.findAll();
    }

    public List<Vehicle> getAllPendingRequests() {
        return vehicleRepository.findByStatus("PENDING");
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public String processVehicleRequest(Long vehicleId, String keycode) throws IOException {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(vehicleId);
        if (optionalVehicle.isPresent()) {
            Vehicle vehicle = optionalVehicle.get();
            vehicle.setStatus("COMPLETED");
            vehicleRepository.save(vehicle);

            Transaction transaction = vehicle.getTransaction();
            if (transaction != null) {
                transaction.setKeycode(keycode);
                transaction.setStatus("FULFILLED");
                transactionRepository.save(transaction);

                String email = vehicle.getKeycodeUser().getEmail();
                emailService.sendEmail(email, "Your Key Code is Ready", "The key code for your vehicle VIN " + vehicle.getVin() + " is: " + keycode);
                return "Keycode processed and email sent.";
            } else {
                return "Transaction not found for vehicle.";
            }
        } else {
            return "Vehicle request not found.";
        }
    }
}