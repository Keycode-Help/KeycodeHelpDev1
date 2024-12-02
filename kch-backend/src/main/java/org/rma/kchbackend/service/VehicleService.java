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
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getPendingVehicles() {
        return vehicleRepository.findByStatus("PENDING");
    }



    public String processVehicleRequest(Long vehicleId, String keycode) throws IOException {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(vehicleId);
        if (optionalVehicle.isPresent()) {
            Vehicle vehicle = optionalVehicle.get();
            vehicle.setStatus("COMPLETED");
            vehicle.setKeycode(keycode);
            vehicleRepository.save(vehicle);

            Transaction transaction = vehicle.getTransaction();
            if (transaction != null) {

                boolean allFulfilled = transaction.getVehicles().stream()
                        .allMatch(v -> "COMPLETED".equals(v.getStatus()));
                if (allFulfilled) {
                    transaction.setStatus("FULFILLED");
                }
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


    private String generateConfirmationNumber() {
        return "CONF-" + System.currentTimeMillis(); // Generate a unique confirmation number
    }
}