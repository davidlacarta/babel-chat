import React, { ReactNode } from "react";
import Head from "next/head";

export type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>Babel chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: "Calibri", "Roboto", sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
}
