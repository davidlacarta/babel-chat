import React, { RefObject } from "react";
import { Lang } from "./useLangs";

type Props = {
  username?: string;
  lang: Lang;
  messageRef: RefObject<any>;
  handleKeyDown: (event: any) => void;
  handleClickAvatar: (event: any) => void;
};

export default function Footer({
  username,
  lang,
  messageRef,
  handleKeyDown,
  handleClickAvatar,
}: Props) {
  return (
    <>
      <div className="bottom_wrapper clearfix">
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
      <style jsx>{`
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
          ${!username && `top: 72px;`}
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
