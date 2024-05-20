import React, { useState } from 'react';
import './MessageInput.css';

const TYPING_TIMER_LENGTH = 500; // ms
const NewMessage = ({ socket }) => {
    const [typing, SetTyping] = useState(false)
    const defaultObj = { content: '', timestamp: new Date().getTime() };
    const [valueInput, setValueInput] = useState(defaultObj);
    const submitForm = (e) => {
        e.preventDefault();
        socket.emit('message', valueInput.content);
        setValueInput(defaultObj);
    };

    const handleTyping = (event) => {
        const { value } = event.target
        setValueInput({ content: value, timestamp: new Date().getTime() });
        const dte = new Date(valueInput.timestamp);
        console.log(dte.getMinutes() + ':' + dte.getSeconds());
        if (!typing) {
            SetTyping(true);
            socket.emit('USER_TYPING');
        }

        setTimeout(() => {
            const typingTimer = new Date().getTime();
            const timeDiff = typingTimer - valueInput.timestamp;
            if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                socket.emit('STOP_TYPING');
                console.log('STOP_TYPING');
                SetTyping(false);
            }
        }, TYPING_TIMER_LENGTH);
    };

    const handleStopTyping = () => {
    };

    return (
        <form onSubmit={submitForm}>
            <input
                autoFocus
                value={valueInput.content}
                placeholder="Type your message"
                onChange={handleTyping}
                onBlur={handleStopTyping}
            />
        </form>
    );
};

export default NewMessage;

