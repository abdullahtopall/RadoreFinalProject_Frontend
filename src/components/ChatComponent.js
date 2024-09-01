// src/components/ChatComponent.js
import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

const ChatComponent = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:44390/chathub') // Hub URL
            .build();

        newConnection.start()
            .then(() => console.log('SignalR Connected'))
            .catch(err => console.log('SignalR Connection Error: ', err));

        newConnection.on('ReceiveMessage', (user, message) => {
            setMessages(prevMessages => [...prevMessages, { user, message }]);
        });

        setConnection(newConnection);

        return () => {
            newConnection.stop();
        };
    }, []);

    const sendMessage = async () => {
        if (connection && message) {
            await connection.send('SendMessage', 'User', message);
            setMessage('');
        }
    };

    return (
        <div>
            <div>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg.user}: {msg.message}</li>
                    ))}
                </ul>
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatComponent;
