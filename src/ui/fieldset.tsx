import styled from "styled-components";

export const Fieldset = styled.fieldset`
  border: none;
  border-radius: var(--border-radius);
  background-color: hsl(255 10% 90% / 0.5);
  legend {
    color: var(--clr-bg);
    font-weight: bold;
    background-color: var(--clr-page-bg);
    padding: 0.25em 0.5em;
    border-radius: var(--border-radius);
  }
`;
