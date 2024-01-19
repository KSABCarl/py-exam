import { useEffect, useState } from "react";

import { Controls } from "./controls";
import Loader from "./loader";
import { Input } from "../ui/input";
import { Packages } from "react-py/dist/types/Packages";
import { usePython } from "react-py";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/ext-language_tools";
import { Pause, Play, RefreshCcw } from "react-feather";
import { Answer, Question } from "../types";
import { Wrapper } from "./wrapper.style";
import styled from "styled-components";
import {
  compressToUTF16,
  decompressFromBase64,
  decompressFromUTF16,
} from "lz-string";

const editorOptions = {
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  useWorker: true,
  autoScrollEditorIntoView: true,
  vScrollBarAlwaysVisible: true,
};

const editorOnLoad = (editor: any) => {
  //   editor.renderer.setScrollMargin(10, 10, 0, 0);
  editor.moveCursorTo(0, 0);
};

interface CodeEditorProps {
  question: Question;
  packages?: Packages;
  onChange: (ans: Answer) => void;
}

export function CodeEditor({ question, packages, onChange }: CodeEditorProps) {
  const { title, id, value, desc } = question;

  const [input, setInput] = useState(value.trimEnd());
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    setInput(value.trimEnd());
    setShowOutput(false);
  }, [value]);

  useEffect(() => {
    onChange({ id, value: input });
  }, [input]);

  const {
    runPython,
    stdout,
    stderr,
    isLoading,
    isRunning,
    interruptExecution,
    isAwaitingInput,
    sendInput,
    prompt,
  } = usePython({ packages });

  function run() {
    runPython(input);
    setShowOutput(true);
  }

  function stop() {
    interruptExecution();
    setShowOutput(false);
  }

  function reset() {
    setShowOutput(false);
    setInput(value.trimEnd());
  }

  return (
    <Wrapper>
      <h3>{title}</h3>
      <p>{desc}</p>

      {isLoading && <Loader />}

      <EditorContainer>
        <AceEditor
          name={id}
          className="editor"
          mode="python"
          theme="ambiance"
          onChange={(newValue) => setInput(newValue)}
          onLoad={editorOnLoad}
          setOptions={editorOptions}
          value={input}
          fontSize="12pt"
        />

        <Controls
          items={[
            {
              label: "Kör",
              icon: <Play size={16} />,
              onClick: run,
              disabled: isLoading || isRunning,
              hidden: isRunning,
            },
            {
              label: "Stopp",
              icon: <Pause size={16} />,
              onClick: stop,
              hidden: !isRunning,
            },
            {
              label: "Rensa",
              icon: <RefreshCcw size={16} />,
              onClick: reset,
              disabled: isRunning,
            },
          ]}
          isAwaitingInput={isAwaitingInput}
        />
      </EditorContainer>
      {isAwaitingInput && <Input prompt={prompt} onSubmit={sendInput} />}

      {showOutput && (
        <Fieldset>
          <legend>Resultat:</legend>
          <Output>
            <code>{stdout}</code>
            <code className="error">{stderr}</code>
          </Output>
        </Fieldset>
      )}
    </Wrapper>
  );
}

const EditorContainer = styled.div`
  position: relative;
  padding-bottom: 28pt;
`;

const Output = styled.pre`
  margin: 0;
  font-size: 10pt;
`;

const Fieldset = styled.fieldset`
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