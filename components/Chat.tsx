import { useRef, useEffect, useState } from "react";

const langs = {
  spain: {
    flag: "🇪🇸",
    code: "es",
    username: "Escribe tu nick aquí...",
    message: "Escribe un mensaje aquí...",
    send: "Enviar",
  },
  england: {
    flag: "🇬🇧",
    code: "en",
    username: "Type your username here...",
    message: "Type a message here...",
    send: "Send",
  },
};

const MAX_MESSAGES = 100;
const MAX_MESSAGES_MARGIN = 10;

function Chat({ room, socket }: { room?; socket }) {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(null);
  const [lang, setLang] = useState(langs.spain);

  const messageRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    socket.emit("join", room || "general");
  }, [socket, room]);

  useEffect(() => {
    socket.on("send", (message) => {
      setMessages((messages) => {
        if (messages.length + 1 > MAX_MESSAGES + MAX_MESSAGES_MARGIN) {
          setTimeout(() => {
            setMessages((messages) =>
              messages.slice(messages.length - MAX_MESSAGES)
            );
          }, 1000);
        }

        return [...messages, message];
      });
    });
  }, [socket]);

  function handleKeyDown({ key, currentTarget: { value: text } }) {
    if (key !== "Enter" || !text) {
      return;
    }

    clearInput();

    if (!username) {
      setUsername(text);
    } else {
      socket.emit("send", {
        message: text,
        username: username,
        room: room || "general",
      });
    }
  }

  function handleClickFlag() {
    if (lang.code === langs.spain.code) {
      setLang(langs.england);
    } else {
      setLang(langs.spain);
    }
  }

  function handleClickAvatar() {
    handleKeyDown({
      key: "Enter",
      currentTarget: { value: messageRef.current.value },
    });
  }

  function clearInput() {
    messageRef.current.value = "";
  }

  return (
    <>
      <div className="chat_window">
        <div className="top_menu">
          <div className={`username ${username && "fill"}`}>
            {username?.slice(0, 3)}
          </div>
          <div className={`title ${room && "room"}`}>
            {(room && `🔒 ${room}`) || `Babel`}
          </div>
          <div className="button" onClick={handleClickFlag}>
            {lang.flag}
          </div>
        </div>
        <ul ref={messagesRef} className="messages">
          {messages.map(
            ({ message, username: messageUsername, translation }, index) => (
              <li
                key={index}
                className={`message appeared ${
                  messageUsername === username ? "right" : "left"
                }`}
              >
                <div className="avatar">{messageUsername.slice(0, 3)}</div>
                <div className="text_wrapper">
                  <div className="text">
                    {message}
                    <small>{translation[lang.code]}</small>
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
        <div className={`bottom_wrapper clearfix ${username && "username"}`}>
          <div className="message_input_wrapper">
            <input
              placeholder={username ? lang.message : lang.username}
              className="message_input"
              ref={messageRef}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="avatar" onClick={handleClickAvatar}>
            {lang.send}
          </div>
        </div>
      </div>
      <style jsx>{`
        .chat_window {
          position: absolute;
          width: 100%;
          max-width: 800px;
          height: 100%;
          border-radius: 10px;
          background-color: #fff;
          left: 50%;
          top: 50%;
          transform: translateX(-50%) translateY(-50%);
          background-color: #f8f8f8;
          overflow: hidden;
        }
        .top_menu {
          background-color: #fff;
          width: 100%;
          display: flex;
          padding: 1rem;
          justify-content: space-between;
        }
        .top_menu .username {
          color: #fdbf68;
          text-transform: uppercase;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 100%;
          font-size: 0.8rem;
          width: 40px;
          height: 40px;
        }
        .top_menu .username.fill {
          border: 1px solid #fdbf68;
        }
        .top_menu .button {
          cursor: pointer;
          font-size: 1.3rem;
          margin-right: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .top_menu .title {
          color: #bcbdc0;
          font-size: 1.5rem;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          max-width: 70%;
          overflow: hidden;
          white-space: nowrap;
        }
        .top_menu .title.room {
          font-size: 0.8rem;
        }
        .messages {
          position: relative;
          list-style: none;
          padding: 20px 10px 0 10px;
          margin: 0;
          height: calc(100% - 162px);
          overflow-y: scroll;
          scroll-behavior: smooth;
        }
        .messages .message {
          clear: both;
          overflow: hidden;
          margin-bottom: 20px;
          transition: all 0.5s linear;
          opacity: 0;
        }
        .messages .message.left .avatar {
          background-color: #f5886e;
          float: left;
        }
        .messages .message.left .text_wrapper {
          background-color: #ffe6cb;
          margin-left: 20px;
        }
        .messages .message.left .text_wrapper::after,
        .messages .message.left .text_wrapper::before {
          right: 100%;
          border-right-color: #ffe6cb;
        }
        .messages .message.left .text {
          color: #c48843;
        }
        .messages .message.right .avatar {
          background-color: #fdbf68;
          float: right;
        }
        .messages .message.right .text_wrapper {
          background-color: #c7eafc;
          margin-right: 20px;
          float: right;
        }
        .messages .message.right .text_wrapper::after,
        .messages .message.right .text_wrapper::before {
          left: 100%;
          border-left-color: #c7eafc;
        }
        .messages .message.right .text {
          color: #45829b;
        }
        .messages .message.appeared {
          opacity: 1;
        }
        .messages .message .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
          color: white;
          font-weight: 900;
        }
        .messages .message .text_wrapper {
          display: inline-block;
          padding: 20px;
          border-radius: 6px;
          width: calc(100% - 85px);
          min-width: 100px;
          position: relative;
        }
        .messages .message .text_wrapper::after,
        .messages .message .text_wrapper:before {
          top: 18px;
          border: solid transparent;
          content: " ";
          height: 0;
          width: 0;
          position: absolute;
          pointer-events: none;
        }
        .messages .message .text_wrapper::after {
          border-width: 13px;
          margin-top: 0px;
        }
        .messages .message .text_wrapper::before {
          border-width: 15px;
          margin-top: -2px;
        }
        .messages .message .text_wrapper .text {
          font-size: 18px;
          font-weight: 300;
        }
        .messages .message .text_wrapper .text small {
          display: block;
          color: gray;
        }
        .bottom_wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          background-color: #fff;
          padding: 20px 20px;
          position: absolute;
        }
        .bottom_wrapper {
          bottom: 0;
        }
        .bottom_wrapper:not(.username) {
          top: 72px;
        }
        .bottom_wrapper .message_input_wrapper {
          display: inline-block;
          height: 50px;
          border-radius: 25px;
          border: 1px solid #bcbdc0;
          width: calc(100% - 90px);
          position: relative;
          padding: 0 20px;
        }
        .bottom_wrapper .message_input_wrapper .message_input {
          border: none;
          height: 100%;
          box-sizing: border-box;
          width: calc(100% - 40px);
          position: absolute;
          outline-width: 0;
          color: gray;
        }
        .bottom_wrapper .avatar {
          cursor: pointer;
          background-color: #a3d063;
          float: right;
          width: 80px;
          height: 50px;
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: capitalize;
          color: white;
        }
      `}</style>
    </>
  );
}

export default Chat;
