package org.rma.kchbackend.service;

import org.rma.kchbackend.model.Transaction;
import org.rma.kchbackend.model.Vehicle;
import org.rma.kchbackend.repository.TransactionRepository;
import org.rma.kchbackend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final TransactionRepository transactionRepository;
    private final EmailService emailService;

    @Autowired
    public VehicleService(VehicleRepository vehicleRepository, TransactionRepository transactionRepository, EmailService emailService) {
        this.vehicleRepository = vehicleRepository;
        this.transactionRepository = transactionRepository;
        this.emailService = emailService;
    }

    public Vehicle saveVehicle(Vehicle vehicle) {
        if (vehicle.getStatus() == null || vehicle.getStatus().isEmpty()) {
            vehicle.setStatus("PENDING"); // Set default status if not provided
        }
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        createTransaction(savedVehicle);
        return savedVehicle;
    }

    public List<Vehicle> getPendingVehicles() {
        return vehicleRepository.findByStatus("PENDING");
    }

    public String processVehicleRequest(Long vehicleId, String keycode) throws IOException {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(vehicleId);
        if (optionalVehicle.isPresent()) {
            Vehicle vehicle = optionalVehicle.get();
            vehicle.setStatus("COMPLETED");
            vehicleRepository.save(vehicle);

            Optional<Transaction> optionalTransaction = transactionRepository.findByVehicles_Id(vehicle.getId());
            if (optionalTransaction.isPresent()) {
                Transaction transaction = optionalTransaction.get();
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

    private void createTransaction(Vehicle vehicle) {
        // Check if a transaction already exists for the vehicle
        if (transactionRepository.findByVehicles_Id(vehicle.getId()).isPresent()) {
            return; // Transaction already exists, do not create another one
        }

        Transaction transaction = new Transaction();
        transaction.setConfirmationNumber(generateConfirmationNumber());
        transaction.setStatus("PENDING");
        transaction.setKeycodeUser(vehicle.getKeycodeUser());

        // Add this vehicle to the transaction
        transaction.getVehicles().add(vehicle); // vehicles list is always initialized now
        vehicle.setTransaction(transaction);

        transactionRepository.save(transaction);
    }

    private String generateConfirmationNumber() {
        return "CONF-" + System.currentTimeMillis(); // Generate a unique confirmation number
    }
}