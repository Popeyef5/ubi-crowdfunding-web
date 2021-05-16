import { Warning } from "@prisma/client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Arrow,
  Break,
  Cell,
  Column,
  PageButtons,
  ResponsiveGrid,
} from "./tools";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";
import { maxItemsFromHeight } from "@ubicrowd/util";

const SORT_FIELD = {
  issuer: "issuer_id",
  target: "target_id",
  created: "created_at",
  signature: "signature",
};

const WarningRow = ({ warning }: { warning: Warning }) => {
  return (
    <ResponsiveGrid sizes={[2, 2, 1, 3]}>
      <Cell>{warning.issuer_id}</Cell>
      <Cell>{warning.target_id}</Cell>
      <Cell>{warning.created_at}</Cell>
      <Cell>
        <CopyToClipboard text={warning.signature}>
          <span>
            <MdContentCopy />{" "}
          </span>
        </CopyToClipboard>
        {warning.signature}
      </Cell>
    </ResponsiveGrid>
  );
};

export default function WarningsTable({ warnings }) {
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
    if (warnings.length % maxItems === 0) {
      extraPages = 0;
    }
    setMaxPage(Math.floor(warnings.length / maxItems) + extraPages);
  }, [maxItems, warnings]);

  const sortedWarnings = useMemo(() => {
    return warnings
      ? warnings
          .slice()
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof Warning] >
                b[sortField as keyof Warning]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1;
            } else {
              return -1;
            }
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : [];
  }, [warnings, maxItems, page, sortField, sortDirection]);

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

  if (!warnings) {
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

      {sortedWarnings.map((a, i) => {
        if (a) {
          return (
            <React.Fragment key={i}>
              <WarningRow warning={a} />
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
