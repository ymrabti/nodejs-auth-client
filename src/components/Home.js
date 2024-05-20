import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Messages from './Messages';
import MessageInput from './MessageInput';
import './Home.css';
import Layout from './layout';
import { useSelector } from 'react-redux';
import { baseURL } from '../api';

export function Home() {
    const token = JSON.parse(localStorage.getItem('jwt'))?.tokens.access.token;
    const data = useSelector(state => state.layout)

    const isUser = data.currentUser.isLoggedIn
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (token && isUser) {
            const newSocket = io(
                baseURL,
                {
                    extraHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setSocket(newSocket);
            return () => newSocket.close();
        } else {
            return () => { };
        }
    }, [isUser, setSocket, token]);

    return (
        <Layout>
            <div className="chat-container">
                {process.env.REACT_APP_API_URL}
                <br />
                {isUser ? (<>
                    <Messages socket={socket} />
                    <MessageInput socket={socket} />
                </>) : (
                    <div>Not Connected</div>
                )}
            </div>

        </Layout>
    );
}
export function HomeTest() {
    return (
        <Layout />
    );
}
