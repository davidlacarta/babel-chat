import App from "next/app";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import theme from "styles/theme";
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
        <ThemeProvider theme={theme}>
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
    font-family: ${theme.fonts.body}
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }
`;
