import { useRef, useEffect, useState } from "react";

import useSocketIo from "./useSocketIo";

function Chat() {
  const [socket] = useSocketIo();
  const [messages, setMessages] = useState([]);

  const messageRef = useRef();

  useEffect(() => {
    socket.on("message", (message) => addToChat(message));
  }, [socket, messages]);

  function handleKeyDown({ key, currentTarget: { value: message } }) {
    if (key !== "Enter" || !message) {
      return;
    }

    clearInput();
    addToChat({ message });

    socket.emit("message", { message });
  }

  function addToChat(message) {
    setMessages([...messages, message]);
  }

  function clearInput() {
    messageRef.current.value = "";
  }

  return (
    <>
      <div className="chat">
        <div className="message">
          <input
            placeholder="message..."
            ref={messageRef}
            onKeyDown={handleKeyDown}
          />
        </div>
        <ul>
          {messages.map(({ message }, index) => (
            <li key={index}>
              <span>{message}</span>
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        .chat {
          position: relative;
          height: 100vh;
          max-width: 800px;
          overflow: hidden;
          margin: auto;
        }

        .message {
          display: flex;
          justify-content: center;
          padding: 1rem;
          position: absolute;
          width: 100%;
          top: 0;
          background: white;
        }

        input {
          width: 100%;
          padding: 1rem;
          border: none;
          border-bottom: 1px solid lightgray;
          font-size: 1.5rem;
        }

        ul {
          display: flex;
          flex-direction: column;
          max-height: calc(100vh - 6rem);
          overflow-y: auto;
          list-style: none;
          margin: 6rem 1rem 1rem 1rem;
          padding: 0;
        }

        li {
          display: flex;
          font-size: 1.5rem;
          margin: 0.5rem 0;
        }

        span {
          display: block;
          border: 1px solid lightgray;
          border-radius: 10px;
          padding: 1rem;
        }
      `}</style>
    </>
  );
}

export default Chat;
