import React, { useState, useEffect, useRef, useCallback } from 'react';

// const FADE_TIME = 150; // ms
const TYPING_TIMER_LENGTH = 400; // ms
const COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

const ChatApp = ({ socket }) => {
    const [username, setUsername] = useState('');
    const [typing, setTyping] = useState(false);
    const [lastTypingTime, setLastTypingTime] = useState(0);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [numUsers, setNumUsers] = useState(0);

    const inputRef = useRef(null);
    const messagesRef = useRef(null);

    const getTypingMessages = useCallback((username) => {
        return messages.filter(msg => msg.typing && msg.username === username);
    }, [messages])


    const addChatMessage = useCallback((data, options = {}) => {
        const typingMessages = getTypingMessages(data.username);
        if (typingMessages.length !== 0) {
            options.fade = false;
            setMessages((prevMessages) => prevMessages.filter(msg => msg.username !== data.username));
        }

        const message = {
            username: data.username,
            message: data.message,
            color: getUsernameColor(data.username),
            typing: data.typing || false,
            isLog: false,
        };
        addMessageElement({ message, options });
    }, [getTypingMessages])

    useEffect(() => {

        const addParticipantsMessage = (data) => {
            setNumUsers(data.numUsers);
            let message = '';
            if (data.numUsers === 1) {
                message += `there's 1 participant`;
            } else {
                message += `there are ${data.numUsers} participants`;
            }
            log(message);
        }

        const log = (message, options = {}) => {
            addMessageElement({ message, options, isLog: true });
        }

        const addChatTyping = (data) => {
            data.typing = true;
            data.message = 'is typing';
            addChatMessage(data);
        }

        socket?.on('login', (data) => {
            addParticipantsMessage(data);
        });

        socket?.on('new message', (data) => {
            addChatMessage(data);
        });

        socket?.on('user joined', (data) => {
            log(`${data.username} joined`);
            addParticipantsMessage(data);
        });

        socket?.on('user left', (data) => {
            log(`${data.username} left`);
            addParticipantsMessage(data);
            removeChatTyping(data);
        });

        socket?.on('USER_TYPING', (data) => {
            addChatTyping(data);
        });

        socket?.on('STOP_TYPING', (data) => {
            removeChatTyping(data);
        });

        socket?.on('disconnect', () => {
            log('you have been disconnected');
        });

        socket?.io.on('reconnect', () => {
            log('you have been reconnected');
            if (username) {
                socket?.emit('add user', username);
            }
        });

        socket?.io.on('reconnect_error', () => {
            log('attempt to reconnect has failed');
        });

        return () => {
            socket?.disconnect();
        };
    }, [username, messages, addChatMessage, socket]);


    const removeChatTyping = (data) => {
        setMessages((prevMessages) => prevMessages.filter(msg => msg.username !== data.username || !msg.typing));
    }

    const addMessageElement = ({ message, options, isLog }) => {
        const msg = {
            ...message,
            options: options,
            isLog: isLog
        };

        setMessages((prevMessages) => {
            const newMessages = options.prepend ? [msg, ...prevMessages] : [...prevMessages, msg];
            return newMessages;
        });

        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }

    const cleanInput = (input) => {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
        updateTyping();
    }

    const handleInputKeyDown = (e) => {
        if (!(e.ctrlKey || e.metaKey || e.altKey)) {
            inputRef.current.focus();
        }
        if (e.key === 'Enter') {
            if (username) {
                sendMessage();
                socket?.emit('STOP_TYPING');
                setTyping(false);
            } else {
                handleSetUsername();
            }
        }
    }

    const handleSetUsername = () => {
        const name = cleanInput(inputRef.current.value.trim());
        if (name) {
            setUsername(name);
            socket?.emit('add user', name);
        }
    }

    const sendMessage = () => {
        const message = cleanInput(inputMessage);
        if (message) {
            setInputMessage('');
            addChatMessage({ username, message });
            socket?.emit('new message', message);
        }
    }
    let timeout;

    const updateTyping = () => {
        if (!typing) {
            setTyping(true);
            timeout?.refresh();
            socket?.emit('USER_TYPING');
        }
        else {
            setLastTypingTime((new Date()).getTime());

            timeout = setTimeout(() => {
                const typingTimer = (new Date()).getTime();
                const timeDiff = typingTimer - lastTypingTime;
                if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                    socket?.emit('STOP_TYPING');
                    console.log('STOP_TYPING_TIMEOUT');
                    setTyping(false);
                }
            }, TYPING_TIMER_LENGTH);
        }
    }

    const getUsernameColor = (username) => {
        let hash = 7;
        for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        const index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    return (
        <div className="chat-container">
            {numUsers}
            <br />
            {!username ? (
                <div className="login page">
                    <div className="form">
                        <h3>What's your nickname?</h3>
                        <input
                            className="usernameInput"
                            ref={inputRef}
                            onKeyDown={handleInputKeyDown}
                        />
                    </div>
                </div>
            ) : (
                <div className="chat page">
                    <div className="chatArea">
                        <ul className="messages" ref={messagesRef}>
                            {messages.map((msg, index) => (
                                <li
                                    key={index}
                                    className={`message ${msg.typing ? 'typing' : ''} ${msg.isLog ? 'log' : ''}`}
                                    style={{ color: msg.color }}
                                >
                                    {msg.username && <span className="username">{msg.username}</span>}
                                    <span className="messageBody">{msg.message}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <input
                        className="inputMessage"
                        value={inputMessage}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        ref={inputRef}
                    />
                </div>
            )}
        </div>
    );
}

export default ChatApp;
