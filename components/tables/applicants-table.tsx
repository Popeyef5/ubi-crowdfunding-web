import { Applicant } from "@prisma/client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Arrow,
  Break,
  Cell,
  Column,
  PageButtons,
} from "./tools";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";
import { maxItemsFromHeight } from "@ubicrowd/util";
import styled from "styled-components"

const SORT_FIELD = {
  poh_account: "poh_account",
  created: "created_at",
  signature: "signature",
};

const MAX_ITEMS = 10;

const ResponsiveGrid = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 2fr 1fr 3fr;
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr auto auto;
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(2) {
       display: none;
    } }
  `;

const ApplicantRow = ({ applicant }: { applicant: Applicant }) => {
  return (
    <ResponsiveGrid sizes={[2, 1, 3]}>
      <Cell>{applicant.poh_account}</Cell>
      <Cell>{applicant.created_at}</Cell>
      <Cell>
        <CopyToClipboard text={applicant.signature}>
          <span>
            <MdContentCopy />{" "}
          </span>
        </CopyToClipboard>
        {applicant.signature}
      </Cell>
    </ResponsiveGrid>
  );
};

export default function ApplicantsTable({ applicants }) {
  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.created);
  const [sortDirection, setSortDirection] = useState<boolean>(true);

  // pagination
  const [maxItems, setMaxItems] = useState(1);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    const max = maxItemsFromHeight(window.innerHeight, 92 + 46 + 36 + 45 + 46 + 255, 54) //Horrible code. Height - Header - padding - top and bottom rows in px
    setMaxItems(max) //Horrible horrible code, only here to launch ASAP. TODO: write properly
  })

  useEffect(() => {
    let extraPages = 1;
    if (applicants.length % maxItems === 0) {
      extraPages = 0;
    }
    setMaxPage(Math.floor(applicants.length / maxItems) + extraPages);
  }, [maxItems, applicants]);

  const sortedApplicants = useMemo(() => {
    return applicants
      ? applicants
          .slice()
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof Applicant] >
                b[sortField as keyof Applicant]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1;
            } else {
              return -1;
            }
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : [];
  }, [applicants, maxItems, page, sortField, sortDirection]);

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField);
      setSortDirection(sortField !== newField ? true : !sortDirection);
    },
    [sortDirection, sortField]
  );

  const arrow = useCallback(
    (field: string) => {
      return sortField === field ? (!sortDirection ? "↑" : "↓") : "";
    },
    [sortDirection, sortField]
  );

  if (!applicants) {
    return <></>;
  }

  return (
    <Column gap={"1rem"}>
      <ResponsiveGrid sizes={[2, 1, 3]}>
        <Cell onClick={() => handleSort(SORT_FIELD.poh_account)}>
          Account {arrow(SORT_FIELD.poh_account)}
        </Cell>
        <Cell onClick={() => handleSort(SORT_FIELD.created)}>
          Applied On {arrow(SORT_FIELD.created)}
        </Cell>
        <Cell onClick={() => handleSort(SORT_FIELD.signature)}>
          Signature {arrow(SORT_FIELD.signature)}
        </Cell>
      </ResponsiveGrid>
      <Break />

      {sortedApplicants.map((a, i) => {
        if (a) {
          return (
            <React.Fragment key={i}>
              <ApplicantRow applicant={a} />
              <Break />
            </React.Fragment>
          );
        }
        return null;
      })}
      <PageButtons>
        <div
          onClick={() => {
            setPage(page === 1 ? page : page - 1);
          }}
        >
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <div>{"Page " + page + " of " + maxPage}</div>
        <div
          onClick={() => {
            setPage(page === maxPage ? page : page + 1);
          }}
        >
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </Column>
  );
}
