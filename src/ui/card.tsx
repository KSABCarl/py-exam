import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import styled from "styled-components";

type Props = HTMLAttributes<HTMLDivElement> & {
  chiildren?: ReactNode;
};

export function Card({ children, ...rest }: Props) {
  return <CardEl {...rest}>{children}</CardEl>;
}

const CardEl = styled.div`
  border-radius: var(--border-radius);
  border: none;
  background: var(--clr-text-bg);
  padding: 1em;
  color: black;
  display: flex;
  align-items: center;
  gap: 0.25em;
  box-shadow: var(--shadow-light);
  & > * {
    margin: 0;
  }
`;
