import React from "react";
import styled from "styled-components";
import { Button } from "../ui/button";

interface ControlProps {
  items: {
    label: string;
    icon?: any;
    onClick: () => void;
    disabled?: boolean;
    hidden?: boolean;
  }[];
  isAwaitingInput?: boolean;
}

export function Controls(props: ControlProps) {
  const { items, isAwaitingInput } = props;
  const visibleItems = items.filter((item) => !item.hidden);

  return (
    <Wrapper>
      {isAwaitingInput && (
        <div>
          <i className="icon">☕︎</i>
          <span>Awaiting input...</span>
        </div>
      )}
      {visibleItems.map((item, i) => (
        <Button
          key={item.label}
          onClick={item.onClick}
          disabled={item.disabled}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: inline-flex;
  gap: 0.25em;
  margin: 0.5em 0;
  padding-inline-end: 0.5em;
`;
