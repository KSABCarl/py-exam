import styled from "styled-components";

export const Description = styled.div`
  border-radius: var(--border-radius);
  border: none;
  background: var(--clr-text-bg);
  padding: 1em;
  color: black;
  box-shadow: var(--shadow-light);
  margin-bottom: 0.5em;

  code {
    font-weight: bold;
    background: var(--clr-editor-bg);
    color: white;
    padding: 0 0.2em;
    font-style: normal;
  }
  pre {
    font-weight: bold;
    background: var(--clr-editor-bg);
    color: white;
    padding: 0.5em 0.5em;
    font-style: normal;
    tab-size: 4;
  }
`;
