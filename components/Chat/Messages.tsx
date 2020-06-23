import React, { RefObject } from "react";
import { Message, MessageType } from "server/shared/types";
import { Lang } from "./useLangs";

type Props = {
  messagesRef: RefObject<HTMLUListElement>;
  messages: Array<Message>;
  lang: Lang;
  username?: string;
  writters: Array<string>;
};

export default function Messages({
  messagesRef,
  messages,
  lang,
  username,
  writters,
}: Props) {
  const writtersWithoutMe = writters.filter((writter) => writter !== username);
  return (
    <>
      <ul ref={messagesRef} className="messages">
        {messages.map(
          (
            { content, author, translation, type, createdAt }: Message,
            index
          ) => {
            switch (type) {
              case MessageType.USER_HAS_JOINED:
                return (
                  <li
                    key={index}
                    className="message joined appeared"
                    dangerouslySetInnerHTML={{
                      __html: `${lang.joined(content!)} <small>${format(
                        createdAt,
                        lang.locale
                      )}</small>`,
                    }}
                  ></li>
                );
              case MessageType.USER_HAS_DISCONNECTED:
                return (
                  <li
                    key={index}
                    className="message disconnected appeared"
                    dangerouslySetInnerHTML={{
                      __html: `${lang.disconnected(content!)} <small>${format(
                        createdAt,
                        lang.locale
                      )}</small>`,
                    }}
                  ></li>
                );
              default:
                return (
                  <li
                    key={index}
                    className={`message appeared ${
                      author === username ? "right" : "left"
                    }`}
                  >
                    <div className="avatar">{author?.slice(0, 3)}</div>
                    <div className="text_wrapper">
                      <div className="text">
                        {content}
                        <small>{translation && translation[lang.code]}</small>
                        <span>{format(createdAt, lang.locale)}</span>
                      </div>
                    </div>
                  </li>
                );
            }
          }
        )}
        {writtersWithoutMe.length > 0 && (
          <li className="message typing appeared">
            {lang.typing(writtersWithoutMe)}
          </li>
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
        .messages .message.joined {
          text-align: center;
          color: #a3d063;
        }
        .messages .message.disconnected {
          text-align: center;
          color: darkred;
        }
        .messages .message.typing {
          color: lightslategray;
          text-align: center;
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

        .messages .message .text_wrapper .text span {
          font-size: small;
          color: lightslategray;
          position: absolute;
          bottom: 1rem;
          right: 1rem;
        }
      `}</style>
    </>
  );
}

function format(dateTime: Date, locale: string) {
  const [hours, minutes] = new Date(dateTime)
    .toLocaleTimeString(locale, { hour12: false })
    .split(":");

  return `${hours}:${minutes}`;
}
