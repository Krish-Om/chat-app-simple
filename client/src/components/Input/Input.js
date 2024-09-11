import React from 'react';
import './Input.css';


const Input = ({setMessage,sendMessage,message}) => {
return(
    <form className='form'>
        <input
            className='input'
            type='text'
            placeholder='Type a message....'
            value={message}
            onChange={({target:{value}})=>setMessage(value)}
            onKeyDown={(e) => {if(e.key === 'Enter')  {e.preventDefault(); sendMessage(e);} }}
        />
        <button className="sendButton" onClick={(e)=>{
            e.preventDefault();
            sendMessage(e);
        }}>Send</button>
    </form>

)}

export default Input;