import styled from "styled-components";

export const Wrapper = styled.div`
  border-top: 4pt dotted var(--clr-editor-bg);
  margin-top: 1em;
  .editor {
    box-shadow: var(--shadow-light);
    border-radius: var(--border-radius);
    min-height: 6rem;
    max-height: 20rem;
  }

  .rsw-editor {
    border-color: var(--clr-editor-bg);
    box-shadow: var(--shadow-light);
    background-color: var(--clr-text-bg);
  }
  .rsw-toolbar {
    background-color: var(--clr-editor-bg);
    border-bottom: none;
    box-shadow: var(--shadow-light);
  }

  .rsw-btn {
    color: var(--clr-text-bg);
    &:hover {
      color: white;
      background-color: black;
    }
  }

  &#notes {
    border-top: 0;
    & > p {
      font-size: 11pt;
      font-style: italic;
    }
    .rsw-ce {
      height: 20em;
      color: black;
    }
  }
`;
