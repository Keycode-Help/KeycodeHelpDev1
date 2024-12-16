package org.rma.kchbackend.controller;

import org.rma.kchbackend.dto.ProcessRequestDto;
import org.rma.kchbackend.dto.SubscriptionDto;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Transaction;
import org.rma.kchbackend.model.Vehicle;
import org.rma.kchbackend.service.KeycodeUserService;
import org.rma.kchbackend.service.SubscriptionService;
import org.rma.kchbackend.service.TransactionService;
import org.rma.kchbackend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class AdminDashboardController {

    private final VehicleService vehicleService;
    private final TransactionService transactionService;
    private final SubscriptionService subscriptionService;
    private final KeycodeUserService keycodeUserService;

    @Autowired
    public AdminDashboardController(
            VehicleService vehicleService,
            TransactionService transactionService,
            SubscriptionService subscriptionService,
            KeycodeUserService keycodeUserService) {
        this.vehicleService = vehicleService;
        this.transactionService = transactionService;
        this.subscriptionService = subscriptionService;
        this.keycodeUserService = keycodeUserService;
    }

    @GetMapping("/pending-requests")
    public List<Vehicle> getPendingRequests() {
        return vehicleService.getPendingVehicles();
    }

    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder) {

        List<Transaction> transactions = transactionService.getAllTransactions();

        // Filter by status
        if (status != null && !status.isEmpty()) {
            transactions = transactions.stream()
                    .filter(t -> t.getStatus().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        // Search by confirmation number or vehicle VIN
        if (search != null && !search.isEmpty()) {
            transactions = transactions.stream()
                    .filter(t -> t.getConfirmationNumber().contains(search) ||
                            t.getVehicles().stream().anyMatch(v -> v.getVin().contains(search)))
                    .collect(Collectors.toList());
        }

        // Sort transactions
        if (sortBy != null && !sortBy.isEmpty()) {
            Comparator<Transaction> comparator;
            switch (sortBy.toLowerCase()) {
                case "confirmationnumber":
                    comparator = Comparator.comparing(Transaction::getConfirmationNumber);
                    break;
                case "status":
                    comparator = Comparator.comparing(Transaction::getStatus);
                    break;
                default:
                    comparator = Comparator.comparing(Transaction::getId);
            }
            if ("desc".equalsIgnoreCase(sortOrder)) {
                comparator = comparator.reversed();
            }
            transactions = transactions.stream().sorted(comparator).collect(Collectors.toList());
        }

        return transactions;
    }

    @GetMapping("/subscriptions")
    public List<SubscriptionDto> getAllSubscriptions() {
        return subscriptionService.getAllSubscriptions().stream()
                .map(subscription -> new SubscriptionDto(
                        subscription.getId(),
                        subscription.getTier().name(),
                        subscription.getKeycodeUser() != null ? subscription.getKeycodeUser().getEmail() : null
                ))
                .collect(Collectors.toList());
    }

    @PostMapping("/process-request")
    public String processRequest(@RequestBody ProcessRequestDto request) throws IOException {
        return vehicleService.processVehicleRequest(request.getVehicleId(), request.getKeycode());
    }

    @GetMapping("/user-history")
    public ResponseEntity<?> getUserHistory(@RequestParam String email) {
        Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        KeycodeUser user = userOptional.get();
        List<Transaction> transactions = transactionService.getTransactionsByUser(user);
        return ResponseEntity.ok(transactions);
    }
}
