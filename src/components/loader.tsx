import React from "react";
import { Loader as LoaderIcon } from "react-feather";
import styled from "styled-components";

export default function Loader() {
  return (
    <LoaderDiv>
      <LoaderIcon className="spin" />
      <span>Startar upp miljön...</span>
    </LoaderDiv>
  );
}

const LoaderDiv = styled.div`
  display: flex;
  gap: 0.5em;
  margin: 0.5em 0;
  padding: 0.5em;
  align-items: center;
  border-radius: var(--border-radius);
  background-color: hsl(255 10% 90% / 0.5);
`;
