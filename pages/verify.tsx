import { postCertification, postWarning, useTarget } from "@ubicrowd/http";
import Layout from "components/layout";
import {
  UBICrowdfundState,
  CrowdfundContext,
} from "components/providers/crowdfund";
import { MediumText, SmallText } from "components/text";
import { Spacer, Wrapper } from "components/util";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { ActionButton } from "components/button";
import ActionRow from "components/action-row";
import BigButton from "components/big-button";
import { PuffLoader } from "react-spinners";
import { FiCheckCircle } from "react-icons/fi";

export default function Verify() {
  const crowdfundState: UBICrowdfundState =
    useContext<UBICrowdfundState>(CrowdfundContext);

  useEffect(() => {
    if (!crowdfundState || !crowdfundState.applicant) Router.push("/");
  }, [crowdfundState]);

  const { target, mutate } = useTarget(crowdfundState?.applicant?.poh_account);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<boolean | null>(null);

  function fetchNewTarget() {
    setResult(null);
    setLoading(true);
    mutate().finally(() => setLoading(false));
  }

  function handleRequest(request: Promise<Response>) {
    setLoading(true);
    request
      .then((value) => setResult(true))
      .catch((reason) => setResult(false))
      .finally(() => {
        setLoading(false);
        setTimeout(fetchNewTarget, 1000);
      });
  }

  function createCertification(issuer_id: string, target_id: string) {
    handleRequest(postCertification(issuer_id, target_id));
  }

  function createWarning(issuer_id: string, target_id: string) {
    handleRequest(postWarning(issuer_id, target_id));
  }

  function visitProfile() {
    window.open(
      `https://app.proofofhumanity.id/profile/${target.poh_account}`,
      "_blank"
    );
  }

  return (
    <Layout>
      <Wrapper padding="0">
        {loading || !target ? (
          <PuffLoader size="35vh" color="var(--secondary)" />
        ) : result ? (
          <FiCheckCircle size="30vh" color="var(--accept)" />
        ) : target.poh_account ? (
          <>
            <MediumText>{target.poh_account}</MediumText>
            <SmallText
              cursor="pointer"
              color="var(--secondary)"
              onClick={visitProfile}
            >
              Inspect on PoH
            </SmallText>
            <Spacer height="6rem" />
            <ActionRow justifyContent="space-around">
              <ActionButton
                accent="warn"
                onClick={() =>
                  createWarning(
                    crowdfundState?.applicant?.poh_account,
                    target.poh_account
                  )
                }
              >
                Warn
              </ActionButton>
              <ActionButton accent="primary" onClick={fetchNewTarget}>
                Pass
              </ActionButton>
              <ActionButton
                accent="accept"
                onClick={() =>
                  createCertification(
                    crowdfundState?.applicant?.poh_account,
                    target.poh_account
                  )
                }
              >
                Certify
              </ActionButton>
            </ActionRow>
          </>
        ) : (
          <>
            <MediumText>No Profiles Left to Verify</MediumText>
            <BigButton callback={() => Router.push("/profile")}>
              Back To Profile
            </BigButton>
          </>
        )}
      </Wrapper>
    </Layout>
  );
}
