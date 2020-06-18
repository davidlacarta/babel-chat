import { useRef, useEffect, useState } from "react";

const langs = {
  spain: {
    flag: "🇪🇸",
    code: "es",
  },
  england: {
    flag: "🇬🇧",
    code: "en",
  },
};

function Chat({ room, socket }) {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState();
  const [lang, setLang] = useState(langs.spain);

  const messageRef = useRef();

  useEffect(() => {
    socket.emit("join", room || "general");
  }, [socket, room]);

  useEffect(() => {
    socket.on("send", (message) => setMessages([...messages, message]));
  }, [socket, messages]);

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
    setUsername(undefined);
  }

  function clearInput() {
    messageRef.current.value = "";
  }

  return (
    <>
      <div className="chat_window">
        <div className="top_menu">
          <div className="buttons">
            <div className="button" onClick={handleClickFlag}>
              {lang.flag}
            </div>
          </div>
          <div className="title">Babel chat {room && `[${room}]`}</div>
        </div>
        <ul className="messages">
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
        <div className="bottom_wrapper clearfix">
          <div className="message_input_wrapper">
            <input
              placeholder={`Type your ${
                username ? "message" : "username"
              } here...`}
              className="message_input"
              ref={messageRef}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div
            className={`avatar ${username && "username"}`}
            onClick={handleClickAvatar}
          >
            {username && username.slice(0, 3)}
          </div>
        </div>
      </div>
      <style jsx>{`
        .chat_window {
          position: absolute;
          width: calc(100% - 20px);
          max-width: 800px;
          height: calc(100% - 20px);
          border-radius: 10px;
          background-color: #fff;
          left: 50%;
          top: 50%;
          transform: translateX(-50%) translateY(-50%);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          background-color: #f8f8f8;
          overflow: hidden;
        }
        .top_menu {
          background-color: #fff;
          width: 100%;
          padding: 20px 0 15px;
          box-shadow: 0 1px 30px rgba(0, 0, 0, 0.1);
        }
        .top_menu .buttons {
          margin: 3px 0 0 20px;
          position: absolute;
        }
        .top_menu .buttons .button {
          cursor: pointer;
        }
        .top_menu .title {
          text-align: center;
          color: #bcbdc0;
          font-size: 20px;
        }
        .messages {
          position: relative;
          list-style: none;
          padding: 20px 10px 0 10px;
          margin: 0;
          height: calc(100% - 140px);
          overflow: scroll;
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
          position: relative;
          width: 100%;
          background-color: #fff;
          padding: 20px 20px;
          position: absolute;
          bottom: 0;
        }
        .bottom_wrapper .message_input_wrapper {
          display: inline-block;
          height: 60px;
          border-radius: 25px;
          border: 1px solid #bcbdc0;
          width: calc(100% - 80px);
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
          background-color: #fdbf68;
          float: right;
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
        .bottom_wrapper .avatar.username {
          cursor: pointer;
        }
        .bottom_wrapper .username.avatar:hover:after {
          content: "🗑️";
          cursor: pointer;
          position: absolute;
          background-color: #fdbf68;
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
      `}</style>
    </>
  );
}

export default Chat;
