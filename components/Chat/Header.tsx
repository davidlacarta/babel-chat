import React from "react";
import { Lang } from "./useLangs";

type Props = {
  username?: string;
  room?: string;
  lang: Lang;
  toogleLang: () => void;
};

export default function Header({ username, room, lang, toogleLang }: Props) {
  return (
    <>
      <div className="top_menu">
        <div className="username">{username?.slice(0, 3)}</div>
        <div className="title">{(room && `🔒 ${room}`) || `Babel`}</div>
        <div className="button" onClick={toogleLang}>
          {lang.flag}
        </div>
      </div>
      <style jsx>{`
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
          ${username && `border: 1px solid #fdbf68;`}
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
          font-size: ${room ? 0.8 : 1.5}rem;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          max-width: 70%;
          overflow: hidden;
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}
