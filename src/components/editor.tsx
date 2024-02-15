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
import { Fieldset } from "../ui/fieldset";
import { Header } from "../ui/header";
import { Description } from "../ui/description";

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
  const { title, id, value, desc, p } = question;

  const [input, setInput] = useState(value.trimEnd());
  const [showOutput, setShowOutput] = useState(false);
  const [modules, setModules] = useState<{ name: string; content: string }[]>(
    []
  );

  useEffect(() => {
    setInput(value.trimEnd());
    setShowOutput(false);
    question.files?.forEach(async (file) => {
      const content = await fetch(file.url).then((resp) => resp.text());
      setModules((m) => [...m, { name: file.name, content }]);
    });
  }, [value]);

  useEffect(() => {
    onChange({ id, value: input });
  }, [input]);

  useEffect(() => {
    watchModules(modules.map((m) => m.name.replace(".py", "")));
  }, [modules]);

  const {
    runPython,
    stdout,
    stderr,
    isLoading,
    isRunning,
    interruptExecution,
    isAwaitingInput,
    writeFile,
    sendInput,
    prompt,
    watchModules,
  } = usePython({ packages });

  function run() {
    modules.forEach((module) => {
      writeFile(module.name, module.content);
    });
    runPython(input);
    setShowOutput(true);
  }

  function stop() {
    interruptExecution();
    setShowOutput(false);
  }

  function reset() {
    if (window.confirm("Är du säker att du vill rensa din kod?")) {
      setShowOutput(false);
      setInput(value.trimEnd());
    }
  }

  return (
    <Wrapper>
      <Header>
        <h3>{title}</h3>
        {p && <p>{p}p</p>}
      </Header>
      <Description dangerouslySetInnerHTML={{ __html: desc }}></Description>
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
          width="auto"
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
          {question.output === "html" ? (
            <>
              <HTMLOutput
                dangerouslySetInnerHTML={{ __html: stdout }}
              ></HTMLOutput>

              <Output>
                <code className="error">{stderr}</code>
              </Output>
            </>
          ) : (
            <Output>
              <code>{stdout}</code>
              <code className="error">{stderr}</code>
            </Output>
          )}
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

const HTMLOutput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
`;
