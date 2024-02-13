import { useEffect, useState } from "react";

import { Answer, Question } from "../types";
import { Wrapper } from "./wrapper.style";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnUndo,
  Editor,
  Toolbar,
} from "react-simple-wysiwyg";
import { Header } from "../ui/header";
import { Description } from "../ui/description";

interface CodeEditorProps {
  question: Question;
  onChange: (ans: Answer) => void;
}

export function TextEditor({ question, onChange }: CodeEditorProps) {
  const { title, id, value, desc, p } = question;

  const [input, setInput] = useState(value.trimEnd());

  useEffect(() => {
    setInput(value.trimEnd());
  }, [value]);

  useEffect(() => {
    onChange({ id, value: input });
  }, [input]);

  return (
    <Wrapper id={id}>
      <Header>
        <h3>{title}</h3>
        {p && <p>{p}p</p>}
      </Header>
      <Description dangerouslySetInnerHTML={{ __html: desc }}></Description>
      <Editor
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ color: "black" }}
      >
        <Toolbar>
          <BtnBold />
          <BtnItalic />
          <BtnBulletList />
          <BtnNumberedList />
          <BtnStrikeThrough />
          <BtnUndo />
          <BtnRedo />
        </Toolbar>
      </Editor>
    </Wrapper>
  );
}
