import React from "react";
import Head from "next/head";

function Layout({ children }) {
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

export default Layout;
