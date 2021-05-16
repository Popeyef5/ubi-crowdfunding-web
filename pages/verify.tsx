import { createCertification, createWarning, useTarget } from "@ubicrowd/http";
import Layout from "components/layout";
import {
  UBICrowdfundState,
  CrowdfundContext,
} from "components/providers/crowdfund";
import { MediumText, SmallText } from "components/text";
import { Spacer, Wrapper } from "components/util";
import Router from "next/router";
import { useContext, useEffect } from "react";
import { ActionButton } from "components/button";
import ActionRow from "components/action-row";
import BigButton from "components/big-button";

export default function Verify() {
  const crowdfundState: UBICrowdfundState =
    useContext<UBICrowdfundState>(CrowdfundContext);

  useEffect(() => {
    if (!crowdfundState || !crowdfundState.applicant) Router.push("/");
  }, [crowdfundState]);

  const { target, mutate } = useTarget(crowdfundState?.applicant?.poh_account);

  return (
    <Layout>
      <Wrapper>
        {target?.poh_account ? (
          <>
            <MediumText>{target.poh_account}</MediumText>
            <SmallText
              cursor="pointer"
              color="var(--secondary)"
              onClick={() =>
                window.open(
                  `https://app.proofofhumanity.id/profile/${target.poh_account}`,
                  "_blank"
                )
              }
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
              <ActionButton accent="primary" onClick={mutate}>
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
        ) : (<>
          <MediumText>No Profiles Left to Verify</MediumText>
          <BigButton callback={() => Router.push('/profile')}>Back To Profile</BigButton></>
        )}
      </Wrapper>
    </Layout>
  );
}
