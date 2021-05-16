import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
  useLazyQuery,
  useQuery,
} from "@apollo/client";
import { MetaMaskState, Web3Context } from "./web3";

export interface PoHState {
  submission: string | null;
}

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/kleros/proof-of-humanity-mainnet",
  cache: new InMemoryCache(),
});

const POH_PROFILE = gql`
  query poHQuery($id: ID!) {
    submission(id: $id) {
      id
    }
  }
`;

export const PoHContext = createContext<PoHState>({ submission: "0" });

function PoHProvider({ children }: { children: React.ReactNode }) {
  const metaMaskState: MetaMaskState = useContext(Web3Context);

  const [getPoHData, { data: poHData }] = useLazyQuery(POH_PROFILE);

  const initialstate: PoHState = {
    submission: null,
  };

  const [poHState, setPoHState] = useState(initialstate);

  function fetchPoHState() {    
      getPoHData({
        variables: { id: metaMaskState.account?.toLowerCase() },
      });
  }

  function updatePoHState() {    
    poHData?.submission
      ? setPoHState({ submission: poHData.submission.id })
      : setPoHState({ submission: null });
  }
  useMemo(fetchPoHState, [metaMaskState.account]);

  useMemo(updatePoHState, [poHData]);

  return <PoHContext.Provider value={poHState}>{children}</PoHContext.Provider>;
}

export default function GraphQLProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloProvider client={client}>
      <PoHProvider>{children}</PoHProvider>
    </ApolloProvider>
  );
}
