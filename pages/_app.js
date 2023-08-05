import { SessionProvider } from "next-auth/react";
import Layout from "../components/layout/Layout";
import "../styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Head>
          <title>Adventure Log</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta
            name="description"
            content="Go on an adventure and discover new places"
          />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
