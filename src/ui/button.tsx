import { ButtonHTMLAttributes, ReactNode } from "react";
import styled from "styled-components";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  chiildren?: ReactNode;
};

export function Button({ children, ...rest }: Props) {
  return <ButtonEl {...rest}>{children}</ButtonEl>;
}

const ButtonEl = styled.button`
  border-radius: var(--border-radius);
  border: none;
  background: var(--clr-btn-bg);
  color: white;
  display: inline-flex;
  align-items: center;
  font-size: 8pt;
  font-weight: bold;
  gap: 4pt;
  box-shadow: var(--shadow);
  transition: var(--transition);
  padding-inline-end: 0.5em;
  cursor: pointer;

  &[disabled] {
    opacity: 0.75;
    cursor: not-allowed;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-raise);
    svg {
      box-shadow: none;
    }
  }

  &.large {
    font-size: 16pt;
    background: var(--clr-btn-alt-bg);
  }

  svg {
    background: white;
    color: var(--clr-bg);
    border-radius: 100%;
    padding: 2pt;
    margin: 2pt;
    box-shadow: var(--shadow);
    transition: var(--transition);
  }
`;
