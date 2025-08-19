package org.rma.kchbackend.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OrderStatusService {
    private final Map<Long, Map<String, Boolean>> userStatus = new ConcurrentHashMap<>();

    public Map<String, Boolean> getStatusForUser(Long userId) {
        return userStatus.computeIfAbsent(userId, id -> new ConcurrentHashMap<>(Map.of(
                "ACCOUNT", false,
                "DOCS", false,
                "PROCESSING", false,
                "COMPLETED", false
        )));
    }

    public void setStage(Long userId, String stage, boolean value) {
        getStatusForUser(userId).put(stage, value);
    }
}


