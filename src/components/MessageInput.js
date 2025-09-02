import React, { useEffect, useState } from 'react';
import './MessageInput.css';

const TYPING_TIMER_LENGTH = 500; // ms
const NewMessage = ({ socket }) => {
  const [typing, SetTyping] = useState(false)
  const [lastTypingTime, setLastTypingTime] = useState(new Date().getTime());
  const [valueInput, setValueInput] = useState('');
  const submitForm = (e) => {
    e.preventDefault();
    socket.emit('message', valueInput);
    setValueInput('');
  };

  const updateTyping = (event) => {
    const { value } = event.target
    setValueInput(value);
    if (!typing) {
      SetTyping(true);
      socket.emit('USER_TYPING');
    }
    setLastTypingTime(new Date().getTime());

    setTimeout(() => {
      const typingTimer = new Date().getTime();
      const timeDiff = typingTimer - lastTypingTime;
      if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
        socket.emit('STOP_TYPING');
        SetTyping(false);
      }
    }, TYPING_TIMER_LENGTH);
  };

  const blur = () => { };

  useEffect(() => {
    return () => {
      if (typing) {
        socket.emit('STOP_TYPING');
        SetTyping(false);
      }
    };
  }, [typing, socket]);

  return (
    <form onSubmit={submitForm}>
      <input
        autoFocus
        value={valueInput.content}
        placeholder="Type your message"
        onChange={updateTyping}
        onBlur={blur}
      />
    </form>
  );
};

export default NewMessage;

