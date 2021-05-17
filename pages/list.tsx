import { GetServerSideProps } from "next";
import Card from "../components/card";
import {
  getFormattedApplicants,
  getFormattedCertifications,
  getFormattedWarnings,
} from "@ubicrowd/prisma";
import { Applicant, Certification, Warning } from "@prisma/client";
import { ApplicantsTable, WarningsTable } from "components/tables";
import { Spacer, Wrapper } from "components/util";
import ActionRow from "components/action-row";
import React, { useMemo, useState } from "react";
import Button, { ButtonArray } from "components/button";
import Layout from "components/layout";
import CertificationsTable from "components/tables/certifications-table";
import {
  createMuiTheme,
  createStyles,
  makeStyles,
  TextField,
  Theme,
  withStyles,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";

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

const FilterTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "var(--secondary)",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "var(-secondary)",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "var(--secondary)",
      },
    },
  },
})(TextField);

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

  const [filter, setFilter] = useState("");

  function match(obj: any, filter: string) {
    if (obj == null) return false;

    return Object.values(obj).some((val) => {
      switch (typeof val) {
        case "number":
          return String(val).includes(filter);
        case "string":
          return val.toLowerCase().includes(filter.toLowerCase());
        case "object":
          return match(val, filter);
        default:
          return false;
      }
    });
  }

  function filterData(objects: any[]) {
    const filtered = objects.filter((obj) => match(obj, filter));
    return filtered;
  }

  const filteredApplicants = useMemo(
    () => filterData(applicants),
    [filter, applicants]
  );
  const filteredCertifications = useMemo(
    () => filterData(certifications),
    [filter, certifications]
  );
  const filteredWarnings = useMemo(
    () => filterData(warnings),
    [filter, warnings]
  );

  function onSearchChanged(event: React.ChangeEvent<HTMLInputElement>) {
    setFilter(event.target.value);
  }

  return applicants ? (
    <Layout>
      <Wrapper padding="36px" justify="start">
        <ActionRow justifyContent="space-between">
          <ButtonArray gap="16px">
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
          </ButtonArray>
          <FilterTextField
          size="small"
            variant="outlined"
            label="Search"
            onChange={onSearchChanged}
          />
        </ActionRow>
        <Card>
          {current === LIST_OPTIONS.applicants ? (
            <ApplicantsTable applicants={filteredApplicants} />
          ) : current === LIST_OPTIONS.certifications ? (
            <CertificationsTable certifications={filteredCertifications} />
          ) : current === LIST_OPTIONS.warnings ? (
            <WarningsTable warnings={filteredWarnings} />
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
