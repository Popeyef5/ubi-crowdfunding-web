import styles from "./layout.module.css";
import Link from "next/link";
import { MetaMaskState, Web3Context } from "./providers/web3";
import { ReactChild, useContext, useMemo } from "react";
import Head from "next/head"

function networkTagFromState(state: MetaMaskState): string | ReactChild {
  switch (state.chainId) {
    case "0x1":
  }
  return (
    <div className={styles.networkTag}>
      {state.chainId === "0x1" ? (
        <>
          <svg viewBox="0 0 7 7" height="8" width="8">
            <circle cx="3.5" cy="3.5" r="3.5" fill="#00c851" />
          </svg>
          Mainnet
        </>
      ) : (
        <>Invalid Network</>
      )}
    </div>
  );
}

export default function Layout({
  children,
  home,
}: {
  children?: React.ReactNode;
  home?;
}) {
  const metaMaskState: MetaMaskState = useContext(Web3Context);

  const networkTag = useMemo<string | ReactChild>(
    () => networkTagFromState(metaMaskState),
    [metaMaskState]
  );

  return (
    <div className={styles.container}>
       <Head>
         <title>UBI for everyone</title>
       </Head>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <div className={styles.links}>
            <Link href="/list">
              <a>Lists</a>
            </Link>
            <Link href="/litepaper.pdf">
              <a>Litepaper</a>
            </Link>
          </div>
          {metaMaskState.status === "connected" && networkTag}
        </div>
        {!home && (
          <div className={styles.backToHome}>
            <Link href="/">
              <a>←</a>
            </Link>
          </div>
        )}
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
