package com.skillx.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "join_requests")
public class JoinRequest {
    
    @Id
    private String id;
    
    private String senderName;
    private String receiverName;
    private String courseTitle;
    private RequestStatus status;
    
    public enum RequestStatus {
        PENDING,
        ACCEPTED,
        REJECTED
    }

    public JoinRequest() {}

    public JoinRequest(String senderName, String receiverName, String courseTitle, RequestStatus status) {
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.courseTitle = courseTitle;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }
    public String getCourseTitle() { return courseTitle; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
}
