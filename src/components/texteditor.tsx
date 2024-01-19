import React, { useEffect, useState } from "react";

import { Controls } from "./controls";
import Loader from "./loader";
import styled from "styled-components";
import { Question } from "../types";
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

interface CodeEditorProps {
  question: Question;
}

export function TextEditor({ question }: CodeEditorProps) {
  const { title, id, value, desc } = question;

  const [input, setInput] = useState(value.trimEnd());

  useEffect(() => {
    setInput(value.trimEnd());
  }, [value]);

  return (
    <Wrapper id={id}>
      <h3>{title}</h3>
      <p>{desc}</p>
      <Editor value={input} onChange={(e) => setInput(e.target.value)}>
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
