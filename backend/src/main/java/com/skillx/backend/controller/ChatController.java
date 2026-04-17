package com.skillx.backend.controller;

import com.skillx.backend.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        chatMessage.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
        String destination = (chatMessage.getRoom() != null && !chatMessage.getRoom().trim().isEmpty()) 
                ? "/topic/room." + chatMessage.getRoom() 
                : "/topic/public";
        messagingTemplate.convertAndSend(destination, chatMessage);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        java.util.Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
        if (sessionAttributes != null) {
            sessionAttributes.put("username", chatMessage.getSender());
            if (chatMessage.getRoom() != null && !chatMessage.getRoom().trim().isEmpty()) {
                sessionAttributes.put("room", chatMessage.getRoom());
            }
        }
        chatMessage.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
        String destination = (chatMessage.getRoom() != null && !chatMessage.getRoom().trim().isEmpty()) 
                ? "/topic/room." + chatMessage.getRoom() 
                : "/topic/public";
        messagingTemplate.convertAndSend(destination, chatMessage);
    }
}
