import { Certification } from "@prisma/client";
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
  issuer: "issuer_id",
  target: "target_id",
  created: "created_at",
  signature: "signature",
};

const ResponsiveGrid = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 2fr 2fr 1fr 3fr;
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr 1fr auto auto;
    & > *:nth-child(4) {
      display: none;
    }
    & > *:nth-child(3) {
       display: none;
    } }
  `;

const CertificationRow = ({ certification }: { certification: Certification }) => {
  return (
    <ResponsiveGrid sizes={[2, 2, 1, 3]}>
      <Cell>{certification.issuer_id}</Cell>
      <Cell>{certification.target_id}</Cell>
      <Cell>{certification.created_at}</Cell>
      <Cell>
        <CopyToClipboard text={certification.signature}>
          <span>
            <MdContentCopy />{" "}
          </span>
        </CopyToClipboard>
        {certification.signature}
      </Cell>
    </ResponsiveGrid>
  );
};

export default function CertificationsTable({ certifications }) {
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
    if (certifications.length % maxItems === 0) {
      extraPages = 0;
    }
    setMaxPage(Math.floor(certifications.length / maxItems) + extraPages);
  }, [maxItems, certifications]);

  const sortedCertifications = useMemo(() => {
    return certifications
      ? certifications
          .slice()
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof Certification] >
                b[sortField as keyof Certification]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1;
            } else {
              return -1;
            }
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : [];
  }, [certifications, maxItems, page, sortField, sortDirection]);

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

  if (!certifications) {
    return <></>;
  }

  return (
    <Column gap={"1rem"}>
      <ResponsiveGrid sizes={[2, 2, 1, 3]}>
        <Cell onClick={() => handleSort(SORT_FIELD.issuer)}>
          Issuer {arrow(SORT_FIELD.issuer)}
        </Cell>
        <Cell onClick={() => handleSort(SORT_FIELD.target)}>
          Target {arrow(SORT_FIELD.target)}
        </Cell>
        <Cell onClick={() => handleSort(SORT_FIELD.created)}>
           On {arrow(SORT_FIELD.created)}
        </Cell>
        <Cell onClick={() => handleSort(SORT_FIELD.signature)}>
          Signature {arrow(SORT_FIELD.signature)}
        </Cell>
      </ResponsiveGrid>
      <Break />

      {sortedCertifications.map((a, i) => {
        if (a) {
          return (
            <React.Fragment key={i}>
              <CertificationRow certification={a} />
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
