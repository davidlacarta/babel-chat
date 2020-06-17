import Head from "next/head";

import Chat from "../components/Chat";

export default function Home() {
  return (
    <>
      <Head>
        <title>Babel chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Chat />
      </main>
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
