package org.rma.kchbackend.service;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Make;
import org.rma.kchbackend.model.Transaction;
import org.rma.kchbackend.model.Vehicle;
import org.rma.kchbackend.repository.MakeRepository;
import org.rma.kchbackend.repository.TransactionRepository;
import org.rma.kchbackend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final TransactionRepository transactionRepository;
    private final EmailService emailService;
    private final MakeRepository makeRepository;
    private final KeycodeNotificationService keycodeNotificationService;

    @Autowired
    public VehicleService(VehicleRepository vehicleRepository, TransactionRepository transactionRepository,
                          EmailService emailService, MakeRepository makeRepository,
                          KeycodeNotificationService keycodeNotificationService) {
        this.vehicleRepository = vehicleRepository;
        this.transactionRepository = transactionRepository;
        this.emailService = emailService;
        this.makeRepository = makeRepository;
        this.keycodeNotificationService = keycodeNotificationService;
    }

    public Vehicle saveVehicle(Vehicle vehicle) {
        if (vehicle.getStatus() == null || vehicle.getStatus().isEmpty()) {
            vehicle.setStatus("PENDING"); // Set default status if not provided
        }
        return vehicleRepository.save(vehicle);
    }


    public Optional<Vehicle> findById(Long vehicleId) {
        return vehicleRepository.findById(vehicleId);
    }
    public List<Vehicle> getPendingVehicles() {
        return vehicleRepository.findByStatus("PENDING");
    }

    public List<Vehicle> getInProgressVehicles(){
        return vehicleRepository.findByStatus("INPROGRESS");
    }

    public List<Vehicle> getVehiclesByStatus(KeycodeUser user, String status) {
        return vehicleRepository.findByKeycodeUserAndStatus(user, status);
    }

    public List<Vehicle> getVehiclesByUser(KeycodeUser user) {
        return vehicleRepository.findByKeycodeUser(user);
    }

    public void updateVehicleRequest(Long vehicleId, String userEmail, String make, String model, String vin,
                                     MultipartFile frontId, MultipartFile backId, MultipartFile registration) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle request not found"));

        if (!"PENDING".equals(vehicle.getStatus())) {
            throw new IllegalArgumentException("You cannot update a completed vehicle request.");
        }

        if (!vehicle.getKeycodeUser().getEmail().equals(userEmail)) {
            throw new SecurityException("You are not authorized to update this vehicle request.");
        }

        Make vehicleMake = makeRepository.findByName(make)
            .orElseThrow(() -> new IllegalArgumentException("Make not found: " + make));
        vehicle.setMake(vehicleMake);
        vehicle.setModel(model);
        vehicle.setVin(vin);

        try {
            if (frontId != null) vehicle.setFrontId(frontId.getBytes());
            if (backId != null) vehicle.setBackId(backId.getBytes());
            if (registration != null) vehicle.setRegistration(registration.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Error processing file uploads", e);
        }

        vehicleRepository.save(vehicle);
    }


    public String processVehicleRequest(Long vehicleId, String keycode, String pinCode) throws IOException {
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

                // Send completion notifications using the new notification service
                try {
                    keycodeNotificationService.sendKeycodeCompletionNotifications(vehicle);
                } catch (Exception e) {
                    System.err.println("⚠️ Failed to send completion notifications: " + e.getMessage());
                    // Fallback to old email method if new notification service fails
                    String email = vehicle.getKeycodeUser().getEmail();
                    String hashedVin = generateHashedVin(vehicle.getVin());
                    emailService.sendNotificationEmail(vehicle.getKeycodeUser().getFname(),email, "Your Key Code is Ready!", "The Key Code for <b>VIN :" + hashedVin + "</b> is <b>" + keycode+"</b>.<br/>" +
                            "The PIN Code for <b>VIN:"+ hashedVin +"</b> is <b>"+pinCode+"</b>.");
                }
                
                return "Keycode processed and notifications sent.";
            } else {
                return "Transaction not found for vehicle.";
            }
        } else {
            return "Vehicle request not found.";
        }
    }

    public String updatePendingRequestStatus(Long vehicleId) throws IOException {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(vehicleId);
        if (optionalVehicle.isPresent()) {
            Vehicle vehicle = optionalVehicle.get();
            vehicle.setStatus("INPROGRESS");
            vehicleRepository.save(vehicle);

            Transaction transaction = vehicle.getTransaction();
            if (transaction != null) {
                    transaction.setStatus("INPROGRESS");
                transactionRepository.save(transaction);

                //Send Email to user regarding Status Update
                String email = vehicle.getKeycodeUser().getEmail();
                System.out.println("In Progress Email:"+email);
                String hashedVin = generateHashedVin(vehicle.getVin());
                String body = "Your Keycode Request for <b>VIN : "+hashedVin+"</b> is <b>In Progress</b>.";
                emailService.sendNotificationEmail(vehicle.getKeycodeUser().getFname(),
                        email, "Keycode Request Status Update!", body);
                return "Status Updated to In Progress";
            } else {
                return "Transaction not found for vehicle.";
            }
        } else {
            return "Vehicle request not found.";
        }
    }


    private String generateConfirmationNumber() {
        return "CONF-" + System.currentTimeMillis();
    }

    private String generateHashedVin(String vin){
        String hashedVin = "";

        //String lastFourCharactersOfVin = vin.substring(1);
        String lastFourCharactersOfVin = vin.substring(13);
        System.out.println(lastFourCharactersOfVin);
        hashedVin = "XXXXXXXXXXXXX"+lastFourCharactersOfVin;
        return hashedVin;
    }
}