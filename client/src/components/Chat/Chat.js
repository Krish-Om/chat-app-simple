import React,{useState,useEffect} from "react";
import queryString from "query-string";
import {useLocation} from "react-router-dom";
import io from 'socket.io-client'

import InfoBar from "../InfoBar/InfoBar";
import Input from '../Input/Input';
import Messages from "../Messages/Messages";

import './Chat.css';

let socket;
const ENDPOINT="https://chat-app-simple-1.onrender.com";

const Chat = ()=>{
    const location = useLocation();
    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const {name, room} = queryString.parse(location.search);
        socket = io(ENDPOINT);
        setName(name);
        setRoom(room);

        socket.emit("join",{name:name,room:room},()=>{});

        return ()=>{
            socket.disconnect();

            socket.off();
        }
    },[location.search]);

    useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages([...messages,message]);
        })
    },[messages]);


    //function for sending messages
    const sendMessage =(e)=>{
        e.preventDefault();
        if(message){
            socket.emit('sendMessage',message,()=>setMessage(''))
        }
    }

    // console.log(message,messages)

    return(
        <div className="outerContainer">
            <div className='container'>
                <InfoBar room = {room}/>
                <Messages messages ={messages} name={name} />
                <Input message={message} setMessage = {setMessage} sendMessage={sendMessage} />
            </div>
        </div>
        );
}

export default Chat;