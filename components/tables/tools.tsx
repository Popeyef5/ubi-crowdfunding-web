import React, { useState } from "react";
import styled from "styled-components";
import ActionRow from "../action-row";
import Button from "../button";

export const Break = styled.div`
  height: 1px;
  background-color: lightgrey;
  width: 100%;
`;

export const Cell = styled.div`
  padding: 0 8px;
  color: darkslategrey;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  @media screen and (max-width: 500px) {
    font-size: 11px;
  }
`;

export const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 0.5em;
`;

export const Arrow = styled.div<{ faded: boolean }>`
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`;

export const Column = styled.div<{
  gap?: "sm" | "md" | "lg" | string;
  justify?:
    | "stretch"
    | "center"
    | "start"
    | "end"
    | "flex-start"
    | "flex-end"
    | "space-between";
}>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) =>
    (gap === "sm" && "8px") ||
    (gap === "md" && "12px") ||
    (gap === "lg" && "24px") ||
    gap};
  justify-items: ${({ justify }) => justify && justify};
`;
