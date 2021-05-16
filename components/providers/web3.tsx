import MetaMaskOnboarding from "@metamask/onboarding";
import { recoverTypedSignatureLegacy } from "eth-sig-util";
import React from "react";
import { useEffect, useState, createContext, useRef } from "react";

interface Web3Window extends Window {
  ethereum?: any;
}

let web3window: Web3Window;

const domain = [
  { name: "name", type: "string" },
  { name: "chainId", type: "unit256" },
];

const operation = [
  { name: "account", type: "address" },
  { name: "", type: "string" },
];

const domainData = {
  name: "UBI Crowdfunder v1",
  chainId: 2,
};

function toMessageParams(data: Object) {
  const msgParams = [];
  for (const entry of Object.entries(data)) {
    msgParams.push({
      type: "string",
      name: `${entry[0]}`,
      value: `${entry[1]}`,
    });
  }
  return msgParams;
}

export async function signData(data: Object, sender: string) {
  const msgParams = toMessageParams(data);
  const signature = await web3window.ethereum.request({
    method: "eth_signTypedData",
    params: [msgParams, sender],
    from: sender,
  });
  return {
    data,
    signature,
  };
}

export async function recoverSigner(data: Object, signature: string) {
  const msgParams = toMessageParams(data);
  const signer = await recoverTypedSignatureLegacy({
    data: msgParams,
    sig: signature,
  });
  return signer;
}

export async function verifySignature(
  data: Object,
  sender: string,
  signature: string
) {
  const signer = await recoverSigner(data, signature);
  return signer === sender;
}

export interface MetaMaskState {
  status: string;
  accounts: string[];
  chainId: string | null;
  networkId: string | null;
}

export const Web3Context = createContext<MetaMaskState>({
  status: "loading",
  accounts: [],
  chainId: null,
  networkId: null,
});

export interface Web3Methods {
  install: () => void;
  connect: () => void;
}

export const Web3MethodsContext = createContext<Web3Methods>({
  install: () => {},
  connect: () => {}
})

const ETHEREUM_MAINNET = {
  chainId: "0x1",
  networkId: "1"
}

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {  
  const onboarding = useRef<MetaMaskOnboarding>();

  const inistialState: MetaMaskState = {
    status: "loading",
    accounts: [],
    chainId: null,
    networkId: null,

  };

  const [metaMaskState, setMetaMaskState] = useState(inistialState);

  function newAccountsState(accounts: string[], state?: MetaMaskState) {
    const newState: MetaMaskState = Object.assign(
      {},
      state ? state : metaMaskState
    );
    accounts && accounts.length > 0
      ? Object.assign(newState, {
          status: "connected",
          accounts,
        })
      : Object.assign(newState, {
          status: "disconnected",
          accounts,
        });
        console.log('New State:', newState);
        
    return newState;
  }

  function newChainState(chainId: string, state?: MetaMaskState) {
    const newState: MetaMaskState = Object.assign(
      {},
      state ? state : metaMaskState
    );
    Object.assign(newState, { chainId });
    //if (chainId !== ETHEREUM_MAINNET.chainId) Object.assign(newState, { accounts: [] })
    return newState;
  }

  function newNetworkState(networkId: string, state?: MetaMaskState) {
    const newState: MetaMaskState = Object.assign(
      {},
      state ? state : metaMaskState
    );
    Object.assign(newState, { networkId });
    return newState;
  }

  function onNewAccounts(accounts: string[]) {
    const state = newAccountsState(accounts);
    setMetaMaskState(state);
  }

  function onNewChain(chainId: string) {
    const state = newChainState(chainId);
    setMetaMaskState(state);
    console.log(state);
    
  }

  function onNewNetwork(networkId: string) {
    const state = newNetworkState(networkId);
    setMetaMaskState(state);
  }

  function installMetaMask() {
    onboarding.current.startOnboarding();
  }

  function connectToMetaMask() {
    web3window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then(onNewAccounts);
  }

  function updateMetaMaskState() {
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
      setMetaMaskState(
        Object.assign(metaMaskState, {
          status: "not-installed",
          accounts: [],
        })
      );
      return;
    }

    const accountsPromise = web3window.ethereum.request({
      method: "eth_accounts",
    });
    const chainPromise = web3window.ethereum.request({
      method: "eth_chainId",
    });
    const networkPromise = web3window.ethereum.request({
      method: "net_version",
    });

    Promise.all([accountsPromise, chainPromise, networkPromise]).then(
      ([accounts, chainId, networkId]: [string[], string, string]) => {
        let state: MetaMaskState = newAccountsState(accounts);
        state = newChainState(chainId, state);
        state = newNetworkState(networkId, state);
        setMetaMaskState(state);
      }
    );
  }

  useEffect(() => {    
    web3window = window;
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    (async () => {
      updateMetaMaskState();
    })();
  }, []);

  useEffect(() => {
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) return  
    web3window.ethereum.autoRefreshOnNetworkChange = false;
    web3window.ethereum.on("chainChanged", onNewChain);
    web3window.ethereum.on("networkChanged", onNewNetwork);
    web3window.ethereum.on("accountsChanged", onNewAccounts);
  });

  return (
    <Web3Context.Provider value={metaMaskState}>
      <Web3MethodsContext.Provider value={{install: installMetaMask, connect: connectToMetaMask}}>
        {children}
      </Web3MethodsContext.Provider>
    </Web3Context.Provider>
  );
}
