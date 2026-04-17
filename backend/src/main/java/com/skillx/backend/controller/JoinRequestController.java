package com.skillx.backend.controller;

import com.skillx.backend.model.JoinRequest;
import com.skillx.backend.repository.JoinRequestRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class JoinRequestController {

    @Autowired
    private JoinRequestRepository joinRequestRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public ResponseEntity<JoinRequest> createRequest(@RequestBody JoinRequest request) {
        System.out.println("Processing join request: " + request.getSenderName() + " -> " + request.getReceiverName() + " for " + request.getCourseTitle());
        try {
            request.setStatus(JoinRequest.RequestStatus.PENDING);
            JoinRequest saved = joinRequestRepository.save(request);
            
            // Notify the receiver about the new request
            messagingTemplate.convertAndSend("/topic/notifications/" + request.getReceiverName(), saved);
            System.out.println("Join request saved and notification sent successfully.");
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error saving join request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/receiver/{username}")
    public ResponseEntity<List<JoinRequest>> getPendingRequestsForReceiver(@PathVariable String username) {
        List<JoinRequest> requests = joinRequestRepository.findByReceiverNameAndStatus(username, JoinRequest.RequestStatus.PENDING);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/sender/{username}")
    public ResponseEntity<List<JoinRequest>> getRequestsBySender(@PathVariable String username) {
        List<JoinRequest> requests = joinRequestRepository.findBySenderName(username);
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<JoinRequest> acceptRequest(@PathVariable String id) {
        Optional<JoinRequest> opt = joinRequestRepository.findById(id);
        if (opt.isPresent()) {
            JoinRequest request = opt.get();
            request.setStatus(JoinRequest.RequestStatus.ACCEPTED);
            JoinRequest saved = joinRequestRepository.save(request);
            
            // Notify the sender that their request was accepted
            messagingTemplate.convertAndSend("/topic/notifications/" + request.getSenderName(), saved);
            
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<JoinRequest> rejectRequest(@PathVariable String id) {
        Optional<JoinRequest> opt = joinRequestRepository.findById(id);
        if (opt.isPresent()) {
            JoinRequest request = opt.get();
            request.setStatus(JoinRequest.RequestStatus.REJECTED);
            JoinRequest saved = joinRequestRepository.save(request);
            
            // Notify the sender that their request was rejected
            messagingTemplate.convertAndSend("/topic/notifications/" + request.getSenderName(), saved);
            
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.notFound().build();
    }
}
