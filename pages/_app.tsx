import App from "next/app";
import Head from "next/head";
import { Grommet, grommet as grommetTheme } from "grommet";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <title>Babel</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Grommet theme={grommetTheme} full>
          <Component {...pageProps} />
        </Grommet>
      </>
    );
  }
}
