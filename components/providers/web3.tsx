import MetaMaskOnboarding from "@metamask/onboarding";
import { recoverTypedSignatureLegacy } from "eth-sig-util";
import React, { VideoHTMLAttributes } from "react";
import { useEffect, useState, createContext, useRef } from "react";

interface Web3Window extends Window {
  ethereum?: any;
}

let web3window: Web3Window;

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
  account: string | null;
  accounts: string[];
  chainId: string | null;
}

export const Web3Context = createContext<MetaMaskState>({
  status: "loading",
  account: null,
  accounts: [],
  chainId: null,
});

export interface Web3Methods {
  install: () => void;
  connect: () => void;
  setState: (metaMaskState: MetaMaskState) => void;
}

export const Web3MethodsContext = createContext<Web3Methods>({
  install: () => {},
  connect: () => {},
  setState: (metaMaskState: MetaMaskState) => {},
});

const ETHEREUM_MAINNET = {
  chainId: "0x1",
  networkId: "1",
};

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const onboarding = useRef<MetaMaskOnboarding>();

  const inistialState: MetaMaskState = {
    status: "loading",
    account: null,
    accounts: [],
    chainId: null,
  };

  const [metaMaskState, _setMetaMaskState] = useState(inistialState);
  const metaMaskStateRef = useRef(metaMaskState);

  function setMetaMaskState(state: MetaMaskState) {
    metaMaskStateRef.current = state;
    _setMetaMaskState(state);
  }

  function newAccountsState(accounts: string[], state?: MetaMaskState) {
    const newState: MetaMaskState = Object.assign(
      {},
      state ? state : metaMaskStateRef.current
    );
    accounts && accounts.length > 0
      ? Object.assign(newState, {
          status: "connected",
          account: accounts[0],
          accounts,
        })
      : Object.assign(newState, {
          status: "disconnected",
          account: null,
          accounts,
        });
    return newState;
  }

  function newChainState(chainId: string, state?: MetaMaskState) {
    const newState: MetaMaskState = Object.assign(
      {},
      state ? state : metaMaskStateRef.current
    );
    chainId !== ETHEREUM_MAINNET.chainId
      ? Object.assign(newState, { chainId, account: null })
      : newState.accounts.length > 0
      ? Object.assign(newState, { chainId, account: newState.accounts[0] })
      : Object.assign(newState, { chainId });
    return newState;
  }

  function onNewAccounts(accounts: string[]) {
    const state = newAccountsState(accounts);
    setMetaMaskState(state);
  }

  function onNewChain(chainId: string) {
    window.location.href = "/";
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

  async function updateMetaMaskState() {
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
      const newState: MetaMaskState = Object.assign(
        {},
        metaMaskStateRef.current
      );
      setMetaMaskState(
        Object.assign(newState, {
          status: "not-installed",
          account: null,
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

    Promise.all([accountsPromise, chainPromise]).then(
      ([accounts, chainId]: [string[], string]) => {
        let state: MetaMaskState = newAccountsState(accounts);
        state = newChainState(chainId, state);
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
      await updateMetaMaskState();
    })();
  }, []);

  useEffect(() => {
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) return;
    web3window.ethereum.autoRefreshOnNetworkChange = false;
    web3window.ethereum.on("chainChanged", onNewChain);
    web3window.ethereum.on("accountsChanged", onNewAccounts);
  }, []);

  return (
    <Web3Context.Provider value={metaMaskState}>
      <Web3MethodsContext.Provider
        value={{
          install: installMetaMask,
          connect: connectToMetaMask,
          setState: setMetaMaskState,
        }}
      >
        {children}
      </Web3MethodsContext.Provider>
    </Web3Context.Provider>
  );
}
