import BigButton from "components/big-button";
import Layout from "components/layout";
import {
  CrowdfundContext,
  UBICrowdfundState,
} from "components/providers/crowdfund";
import { Wrapper } from "components/util";
import { useContext, useEffect } from "react";
import Router from "next/router";
import { MediumText, SmallText } from "components/text";

export default function Profile() {
  const crowdfundState: UBICrowdfundState =
    useContext<UBICrowdfundState>(CrowdfundContext);

  useEffect(() => {
    if (!crowdfundState || !crowdfundState.applicant) Router.push("/");
  }, [crowdfundState]);

  return (
    <Layout>
      {crowdfundState && crowdfundState.applicant ? (
        <Wrapper>
          <MediumText>{crowdfundState.applicant?.poh_account}</MediumText>
          <SmallText>
            {crowdfundState.applicant?.certifications_emitted.length}{" "}
            certifications emmitted
          </SmallText>
          <SmallText>
            {crowdfundState.applicant?.certifications_received.length}{" "}
            certifications received
          </SmallText>
          <SmallText>
            {crowdfundState.applicant?.warnings_emitted.length} warnings
            emmitted
          </SmallText>
          <SmallText>
            {crowdfundState.applicant?.warnings_received.length} warnings
            received
          </SmallText>
          <BigButton
            callback={() => {
              Router.push("/verify");
            }}
          >
            Verify New Profile
          </BigButton>
        </Wrapper>
      ) : (
        <></>
      )}
    </Layout>
  );
}
