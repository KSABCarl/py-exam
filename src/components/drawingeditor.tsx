import { useEffect, useState } from "react";

import { Answer, Question } from "../types";
import { Wrapper } from "./wrapper.style";
import { Header } from "../ui/header";
import { Description } from "../ui/description";
import { useSvgDrawing } from "@svg-drawing/react";
import styled from "styled-components";
import { Button } from "../ui/button";
import { CheckSquare, Edit, RotateCcw, Trash2 } from "react-feather";

interface DrawingEditorProps {
  question: Question;
  onChange: (ans: Answer) => void;
}

export function DrawingEditor({ question, onChange }: DrawingEditorProps) {
  const { title, id, desc, p } = question;

  const [editing, setEditing] = useState(false);
  const [renderRef, draw] = useSvgDrawing({
    penWidth: 2, // pen width
    delay: 50, // Set how many ms to draw points every.
  });

  const resizeFixed = () => {
    if (renderRef.current) {
      if (editing) {
        const width = renderRef.current?.getBoundingClientRect().width;
        renderRef.current.style.width = `${width}px`;
      } else {
        renderRef.current.style.removeProperty("width");
      }
    }
  };

  useEffect(() => {
    resizeFixed();

    if (!editing) {
      const data = draw.getSvgXML() || "";
      if (data.length > 150) {
        onChange({ id, value: data });
      }
    }
  }, [editing]);

  return (
    <Wrapper id={id}>
      <Header>
        <h3>{title}</h3>
        {p && <p>{p}p</p>}
      </Header>
      <Description dangerouslySetInnerHTML={{ __html: desc }}></Description>
      <DrawingContainer>
        <Buttons
          items={[
            {
              label: editing ? "Spara" : "Redigera",
              icon: editing ? <CheckSquare /> : <Edit />,
              onClick: () => {
                setEditing((e) => !e);
              },
            },
            {
              label: "Rensa",
              icon: <Trash2 />,
              onClick: draw.clear,
              disabled: !editing,
            },
            {
              label: "Ångra",
              icon: <RotateCcw />,
              onClick: draw.undo,
              disabled: !editing,
            },
          ]}
        ></Buttons>
        <Canvas ref={renderRef} className={!editing ? "disabled" : ""} />
      </DrawingContainer>
    </Wrapper>
  );
}

const Buttons = ({
  items,
}: {
  items: {
    label: string;
    icon?: any;
    onClick: () => void;
    disabled?: boolean;
  }[];
}) => {
  return (
    <ButtonWrapper>
      {items.map((item, i) => (
        <Button
          key={item.label}
          onClick={item.onClick}
          disabled={item.disabled}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </ButtonWrapper>
  );
};

const DrawingContainer = styled.div`
  display: flex;
  gap: 0.25em;
  flex-direction: column;
  border-radius: var(--border-radius);
  border: none;
  background: var(--clr-text-bg);
  padding: 1em;
  color: black;
  box-shadow: var(--shadow-light);
  margin-bottom: 0.5em;
`;

const Canvas = styled.div`
  height: 400px;
  border: 1px dotted var(--clr-editor-bg);
  margin: 4px;
  cursor: crosshair;
  &.disabled {
    pointer-events: none;
    cursor: grab;
  }
`;

const ButtonWrapper = styled.div`
position: absolute;
display: inline-flex;
gap: 0.25em;
padding-inline-end: 0.5em;
}
`;
