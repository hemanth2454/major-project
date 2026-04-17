'use strict';

const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const messageArea = document.querySelector('#messageArea');
const connectingElement = document.querySelector('.connecting');

let stompClient = null;
let username = null;
const urlParams = new URLSearchParams(window.location.search);
const room = urlParams.get('room');

document.addEventListener('DOMContentLoaded', () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        document.querySelector('#name').value = user.name;
    }
    
    if (room) {
        const chatHeaderTitle = document.querySelector('.chat-header h2');
        if (chatHeaderTitle) {
            chatHeaderTitle.textContent = `Private Chat: ${room.replace('_', ' & ')}`;
        }
    }
});

function connect(event) {
    username = document.querySelector('#name').value.trim();

    if (username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        // Connect to the Spring Boot WebSocket endpoint
        // NOTE: The backend needs to run on port 8080. Update if different.
        const socket = new SockJS(CONFIG.WS_URL);
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected() {
    const topic = room ? `/topic/room.${room}` : '/topic/public';
    // Subscribe to the dynamic Topic
    stompClient.subscribe(topic, onMessageReceived);

    // Tell your username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN', room: room})
    );

    connectingElement.classList.add('hidden');
}

function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = '#f44336';
}

function sendMessage(event) {
    const messageContent = messageInput.value.trim();

    if (messageContent && stompClient) {
        const chatMessage = {
            sender: username,
            content: messageContent,
            type: 'CHAT',
            room: room
        };

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);

    const messageElement = document.createElement('li');
    messageElement.classList.add('chat-message');

    if (message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
        const textElement = document.createElement('p');
        textElement.textContent = message.content;
        messageElement.appendChild(textElement);
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
        const textElement = document.createElement('p');
        textElement.textContent = message.content;
        messageElement.appendChild(textElement);
    } else {
        messageElement.classList.add(message.sender === username ? 'my-message' : 'other-message');

        const senderElement = document.createElement('div');
        senderElement.classList.add('message-sender');
        senderElement.textContent = message.sender;

        const textElement = document.createElement('div');
        textElement.classList.add('message-bubble');
        textElement.textContent = message.content;
        
        if(message.timestamp) {
            const timeElement = document.createElement('span');
            timeElement.classList.add('message-time');
            timeElement.textContent = message.timestamp;
            textElement.appendChild(timeElement);
        }

        messageElement.appendChild(senderElement);
        messageElement.appendChild(textElement);
    }

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);
