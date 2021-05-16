import { GetServerSideProps } from "next";
import Card from "../components/card";
import {
  getFormattedApplicants,
  getFormattedCertifications,
  getFormattedWarnings,
} from "@ubicrowd/prisma";
import { Applicant, Certification, Warning } from "@prisma/client";
import { ApplicantsTable, WarningsTable } from "components/tables";
import { Wrapper } from "components/util";
import ActionRow from "components/action-row";
import React, { useState } from "react";
import Button from "components/button";
import Layout from "components/layout";
import CertificationsTable from "components/tables/certifications-table";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const applicants = await getFormattedApplicants();
  const certifications = await getFormattedCertifications();
  const warnings = await getFormattedWarnings();

  return {
    props: {
      applicants,
      certifications,
      warnings,
    },
  };
};

const LIST_OPTIONS = {
  applicants: "applicants",
  certifications: "certifications",
  warnings: "warnings",
};

export default function Lists({
  applicants,
  certifications,
  warnings,
}: {
  applicants: Applicant[];
  certifications: Certification[];
  warnings: Warning[];
}) {
  const [current, setCurrent] = useState(LIST_OPTIONS.applicants);

  return applicants ? (
    <Layout>
      <Wrapper padding="36px" justify="start">
        <ActionRow>
          <React.Fragment>
            <Button
              onClick={() => {
                setCurrent(LIST_OPTIONS.applicants);
              }}
              accent={
                current === LIST_OPTIONS.applicants ? "primary" : "outline"
              }
            >
              Applicants
            </Button>
            <Button
              onClick={() => {
                setCurrent(LIST_OPTIONS.certifications);
              }}
              accent={
                current === LIST_OPTIONS.certifications ? "primary" : "outline"
              }
            >
              Certifications
            </Button>
            <Button
              onClick={() => {
                setCurrent(LIST_OPTIONS.warnings);
              }}
              accent={current === LIST_OPTIONS.warnings ? "primary" : "outline"}
            >
              Warnings
            </Button>{" "}
          </React.Fragment>
        </ActionRow>
        <Card>
          {current === LIST_OPTIONS.applicants ? (
            <ApplicantsTable applicants={applicants} />
          ) : current === LIST_OPTIONS.certifications ? (
            <CertificationsTable certifications={certifications} />
          ) : current === LIST_OPTIONS.warnings ? (
            <WarningsTable warnings={warnings} />
          ) : (
            <></>
          )}
        </Card>
      </Wrapper>
    </Layout>
  ) : (
    <></>
  );
}
