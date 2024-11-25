package org.rma.kchbackend.controller;

import org.rma.kchbackend.dto.ProcessRequestDto;
import org.rma.kchbackend.model.Vehicle;
import org.rma.kchbackend.model.Transaction;
import org.rma.kchbackend.service.TransactionService;
import org.rma.kchbackend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminDashboardController {

    private final VehicleService vehicleService;
    private final TransactionService transactionService;

    @Autowired
    public AdminDashboardController(VehicleService vehicleService, TransactionService transactionService) {
        this.vehicleService = vehicleService;
        this.transactionService = transactionService;
    }

    @GetMapping("/pending-requests")
    public List<Vehicle> getPendingRequests() {
        return vehicleService.getPendingVehicles();
    }

    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @PostMapping("/process-request")
    public String processRequest(@RequestBody ProcessRequestDto request) throws IOException {
        return vehicleService.processVehicleRequest(request.getVehicleId(), request.getKeycode());
    }
}