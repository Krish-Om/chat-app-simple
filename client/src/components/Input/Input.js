import React from 'react';
import './Input.css';


const Input = ({setMessage, sendMessage, message}) => {
    return (
        <form className="form">
            <input
                className="input"
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={({target: {value}}) => setMessage(value)}
                onKeyDown={event => {
                    if (event.key === 'Enter') {
                        sendMessage(event);
                    }
                }
                }
            />
            <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
        </form>

    )
}

export default Input;