package org.rma.kchbackend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.*;

@Service
public class ChatStreamService {
    private final Map<Long, List<SseEmitter>> userEmitters = new HashMap<>();

    public SseEmitter subscribe(Long userId) {
        SseEmitter emitter = new SseEmitter(0L);
        emitter.onCompletion(() -> remove(userId, emitter));
        emitter.onTimeout(() -> remove(userId, emitter));
        synchronized (userEmitters) {
            userEmitters.computeIfAbsent(userId, k -> new ArrayList<>()).add(emitter);
        }
        try {
            emitter.send(SseEmitter.event().name("hello").data("connected"));
        } catch (IOException ignored) {}
        return emitter;
    }

    public void sendToUser(Long userId, Object payload) {
        List<SseEmitter> list;
        synchronized (userEmitters) {
            list = new ArrayList<>(userEmitters.getOrDefault(userId, Collections.emptyList()));
        }
        for (SseEmitter e : list) {
            try {
                e.send(SseEmitter.event().name("message").data(payload));
            } catch (Exception ex) {
                remove(userId, e);
            }
        }
    }

    private void remove(Long userId, SseEmitter emitter) {
        synchronized (userEmitters) {
            List<SseEmitter> list = userEmitters.get(userId);
            if (list != null) {
                list.remove(emitter);
                if (list.isEmpty()) userEmitters.remove(userId);
            }
        }
    }
}


