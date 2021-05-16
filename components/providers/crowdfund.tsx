import { Applicant, Certification, Warning } from "@prisma/client";
import { useApplicant } from "@ubicrowd/http";
import { createContext, useContext } from "react";
import { PoHContext, PoHState } from "./graphql";

export interface UBICrowdfundState {
  applicant:
    | (Applicant & {
        certifications_emitted: Certification[];
        certifications_received: Certification[];
        warnings_emitted: Warning[];
        warnings_received: Warning[];
      })
    | null;
}

export const CrowdfundContext = createContext<UBICrowdfundState>({
  applicant: null,
});

export default function CrowdfundProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const poHState: PoHState = useContext(PoHContext);

  const { applicant } = useApplicant(poHState.submission);

  return (
    <CrowdfundContext.Provider value={applicant}>
      {children}
    </CrowdfundContext.Provider>
  );
}
