import React, { useEffect, useRef, useState } from "react";
import { usePythonConsole } from "react-py";
import { ConsoleState } from "react-py/dist/types/Console";
import { Controls } from "./controls";
import { AlignLeft, RefreshCcw } from "react-feather";
import Loader from "./loader";
import styled from "styled-components";

const ps1 = ">>> ";
const ps2 = "... ";

export default function Console() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<{ text: string; className?: string }[]>(
    []
  );
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(0);

  const {
    runPython,
    stdout,
    stderr,
    banner,
    consoleState,
    isLoading,
    isRunning,
    interruptExecution,
    isAwaitingInput,
    sendInput,
    prompt,
  } = usePythonConsole();

  const textArea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    banner && setOutput((prev) => [...prev, { text: banner + "\n" }]);
  }, [banner]);

  useEffect(() => {
    stdout && setOutput((prev) => [...prev, { text: stdout }]);
  }, [stdout]);

  useEffect(() => {
    stderr &&
      setOutput((prev) => [
        ...prev,
        { text: stderr + "\n", className: "text-red-500" },
      ]);
  }, [stderr]);

  useEffect(() => {
    if (isLoading) {
      textArea.current?.blur();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isAwaitingInput) {
      setInput("");
      // Remove the last line of output since we render the prompt
      setOutput((prev) => prev.slice(0, -1));
    }
  }, [isAwaitingInput]);

  function getPrompt() {
    return isAwaitingInput
      ? prompt || ps1
      : consoleState === ConsoleState.incomplete
      ? ps2
      : ps1;
  }

  async function send() {
    if (!input) return;
    setCursor(0);
    setHistory((prev) => [input, ...prev]);
    if (isAwaitingInput) {
      setOutput((prev) => [...prev, { text: getPrompt() + " " + input }]);
      sendInput(input);
    } else {
      setOutput((prev) => [...prev, { text: getPrompt() + input + "\n" }]);
      await runPython(input);
    }
    setInput("");
    textArea.current?.focus();
  }

  function clear() {
    setOutput([]);
  }

  function reset() {
    interruptExecution();
    clear();
  }

  return (
    <Wrapper>
      <Controls
        items={[
          {
            label: "Clear",
            icon: <AlignLeft />,
            onClick: clear,
            disabled: isRunning,
          },
          {
            label: "Reset",
            icon: <RefreshCcw />,
            onClick: reset,
          },
        ]}
      />

      {isLoading && <Loader />}

      <pre>
        {output.map((line, i) => (
          <code className={line.className} key={i}>
            {line.text}
          </code>
        ))}
        <Prompt>
          <code className="text-gray-500">{getPrompt()}</code>
          {/* <span className="text-gray-500 group-focus-within:hidden">|</span> */}
          <textarea
            ref={textArea}
            value={input}
            onChange={(e) => {
              const value = e.target.value;
              setHistory((prev) => [value, ...prev.slice(1)]);
              setInput(value);
            }}
            onKeyDown={(e: any) => {
              const start = e.target.selectionStart;
              const end = e.target.selectionEnd;

              switch (e.key) {
                case "Enter":
                  e.preventDefault();
                  !e.shiftKey && send();
                  break;
                case "ArrowUp":
                  if (start === 0 && end === 0) {
                    setInput(history[cursor]);
                    setCursor((prev) =>
                      Math.min(...[history.length - 1, prev + 1])
                    );
                  }
                  break;
                case "ArrowDown":
                  if (input && start === input.length && end === input.length) {
                    setInput(history[cursor]);
                    setCursor((prev) => Math.max(...[0, prev - 1]));
                  }
                  break;
                default:
                  break;
              }
            }}
            autoCapitalize="off"
            spellCheck="false"
          />
        </Prompt>
      </pre>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  flex: 1;
`;

const Prompt = styled.div`
  display: flex;
  align-items: stretch;
  textarea {
    color: inherit;
    resize: none;
    width: 100%;
    background: transparent;
    border: none;
    &:focus {
      outline: none;
    }
  }
`;
