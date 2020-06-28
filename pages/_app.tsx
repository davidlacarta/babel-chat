import App from "next/app";
import Head from "next/head";
import { Grommet, grommet as grommetTheme } from "grommet";
import { StateProvider, reducer } from "../state";
import { langs } from "i18n/langs";
import { createGlobalStyle } from "styled-components";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <GlobalStyle />
        <StateProvider initialState={{ lang: langs.spain }} reducer={reducer}>
          <Head>
            <title>Babel</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Grommet theme={grommetTheme} full style={{ height: "100%" }}>
            <Component {...pageProps} />
          </Grommet>
        </StateProvider>
      </>
    );
  }
}

const GlobalStyle = createGlobalStyle`
  html, 
  body, 
  body > div {
    height: 100%;
  }
`;
