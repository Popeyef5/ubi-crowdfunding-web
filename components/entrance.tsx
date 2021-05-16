import React, { ReactChild } from "react";
import { useContext } from "react";
import { PulseLoader } from "react-spinners";
import BigButton from "./big-button";
import { PoHContext, PoHState } from "./providers/graphql";
import MorphingText from "./morphing-text";
import {
  MetaMaskState,
  Web3Context,
  Web3Methods,
  Web3MethodsContext,
} from "./providers/web3";
import { CrowdfundContext, UBICrowdfundState } from "./providers/crowdfund";
import { createApplicant } from "@ubicrowd/http";
import Router from "next/router"

function callToAction(
  metaMaskState: MetaMaskState,
  poHState: PoHState,
  crowdfundState: UBICrowdfundState,
  web3methods: Web3Methods
): () => void {
  if (metaMaskState.chainId !== "0x1") return () => {}
  switch (metaMaskState.status) {
    case "loading":
      return () => {};
    case "not-installed":
      return web3methods.install;
    case "disconnected":
      return web3methods.connect;
    case "connected":
      switch (poHState?.submission) {
        case "0":
          return () => {};
        case null:
          return () => {
            window.location.assign("https://proofofhumanity.id");
          };
        default:
          switch (crowdfundState?.applicant) {
            case undefined:
              return () => {}
            case null:              
              return () => {createApplicant(metaMaskState.accounts[0])};
            default:
              return () => {Router.push('/profile')};
          }
      }
    default:
      return () => {};
  }
}

function callToActionMessage(
  metaMaskState: MetaMaskState,
  poHState: PoHState,
  crowdfundState: UBICrowdfundState
): string | ReactChild {
  if (metaMaskState.chainId !== "0x1") return "Please Connect to Mainnet"
  switch (metaMaskState.status) {
    case "loading":
      return <PulseLoader color={"#ffffff"} size={20} />;
    case "not-installed":
      return "Install MetaMask";
    case "disconnected":
      return "Connect your wallet";
    case "connected":
      switch (poHState?.submission) {
        case "0":
          return <PulseLoader color={"#ffffff"} size={20} />;
        case null:
          return "Register to PoH";
        default:
          console.log('Crowdfund State:', crowdfundState);
          
          switch (crowdfundState?.applicant) {
            case undefined:
              return <PulseLoader color={"#ffffff"} size={20} />
            case null:
              return "Apply for funding";
            default:
              return "My Profile";
          }
      }
    default:
      return <></>;
  }
}
export default function Entrance() {
  const metaMaskState: MetaMaskState = useContext<MetaMaskState>(Web3Context);
  const poHState: PoHState = useContext<PoHState>(PoHContext);
  const crowdfundState: UBICrowdfundState =
    useContext<UBICrowdfundState>(CrowdfundContext);
  const web3methods: Web3Methods = useContext<Web3Methods>(Web3MethodsContext);

  return (
    <>
      <MorphingText />
      <BigButton
        callback={callToAction(
          metaMaskState,
          poHState,
          crowdfundState,
          web3methods
        )}
      >
        {callToActionMessage(metaMaskState, poHState, crowdfundState)}
      </BigButton>
    </>
  );
}
