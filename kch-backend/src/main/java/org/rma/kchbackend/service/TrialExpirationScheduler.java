package org.rma.kchbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TrialExpirationScheduler {

    @Autowired
    private TrialService trialService;

    /**
     * Check for expired trials every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    public void checkExpiredTrials() {
        try {
            System.out.println("Checking for expired trials...");
            trialService.checkAndHandleExpiredTrials();
        } catch (Exception e) {
            System.err.println("Error in trial expiration scheduler: " + e.getMessage());
        }
    }
}
