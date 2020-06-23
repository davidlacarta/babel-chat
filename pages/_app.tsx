import App from "next/app";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { defaultTheme } from "styleguide/theme";
import Head from "next/head";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <GlobalStyle />
        <Head>
          <title>Babel</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ThemeProvider theme={defaultTheme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </>
    );
  }
}

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: "Calibri", "Roboto", sans-serif;
  }

  * {
    box-sizing: border-box;
  }
`;
