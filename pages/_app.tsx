import { AppProps } from "next/dist/next-server/lib/router/router";
import GraphQLProvider from "../components/providers/graphql";
import Web3Provider from "../components/providers/web3";
import CrowdfundProvider from "../components/providers/crowdfund";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <GraphQLProvider>
        <CrowdfundProvider>
          <Component {...pageProps} />
        </CrowdfundProvider>
      </GraphQLProvider>
    </Web3Provider>
  );
}

export default MyApp;
