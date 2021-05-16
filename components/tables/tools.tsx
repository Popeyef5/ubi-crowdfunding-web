import React, { useState } from "react";
import styled from "styled-components";
import ActionRow from "../action-row";
import Button from "../button";

export const ResponsiveGrid = styled.div<{
  sizes?: number[];
}>`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: ${({ sizes }) =>
    sizes.map((size) => `${size}fr`).join(" ")};
  }

  @media screen and (max-width: 500px) {
    & > *:nth-child(3) {
      color: red;
      display: none;
    }
    & > *:nth-child(2) {
      color: red;
      display: none;
    } }
  `;

export const Break = styled.div`
  height: 1px;
  background-color: lightgrey;
  width: 100%;
`;

export const Cell = styled.div`
  color: darkslategrey;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
