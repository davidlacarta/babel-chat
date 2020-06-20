import React, { RefObject } from "react";
import { Message } from "shared/types";
import { Lang } from "./useLangs";

type Props = {
  messagesRef: RefObject<HTMLUListElement>;
  messages: Array<Message>;
  lang: Lang;
  username?: string;
};

export default function Messages({
  messagesRef,
  messages,
  lang,
  username,
}: Props) {
  return (
    <>
      <ul ref={messagesRef} className="messages">
        {messages.map(
          (
            { message, username: messageUsername, translation }: Message,
            index
          ) => (
            <li
              key={index}
              className={`message appeared ${
                messageUsername === username ? "right" : "left"
              }`}
            >
              <div className="avatar">{messageUsername?.slice(0, 3)}</div>
              <div className="text_wrapper">
                <div className="text">
                  {message}
                  <small>{translation && translation[lang.code]}</small>
                </div>
              </div>
            </li>
          )
        )}
      </ul>
      <style jsx>{`
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
      `}</style>
    </>
  );
}
