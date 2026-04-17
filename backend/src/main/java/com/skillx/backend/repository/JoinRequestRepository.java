package com.skillx.backend.repository;

import com.skillx.backend.model.JoinRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JoinRequestRepository extends MongoRepository<JoinRequest, String> {
    List<JoinRequest> findByReceiverNameAndStatus(String receiverName, JoinRequest.RequestStatus status);
    List<JoinRequest> findBySenderName(String senderName);
}
