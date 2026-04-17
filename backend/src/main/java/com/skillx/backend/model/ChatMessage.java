package com.skillx.backend.model;

public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
    private String timestamp;
    private String room;

    public ChatMessage() {}

    public ChatMessage(MessageType type, String content, String sender, String timestamp, String room) {
        this.type = type;
        this.content = content;
        this.sender = sender;
        this.timestamp = timestamp;
        this.room = room;
    }

    public MessageType getType() { return type; }
    public void setType(MessageType type) { this.type = type; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }
}
