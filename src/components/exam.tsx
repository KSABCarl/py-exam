import React, { useEffect, useRef, useState } from "react";

import { PythonProvider } from "react-py";
import { Answer, Question } from "../types";
import { CodeEditor } from "./editor";
import { TextEditor } from "./texteditor";
import { useProctoring } from "../hooks/useProctoring";
import styled from "styled-components";
import { Card } from "../ui/card";
import Console from "./console";
import { EditorProvider } from "react-simple-wysiwyg";
import { Edit } from "react-feather";
import { compressToUTF16 } from "lz-string";
import { Button } from "../ui/button";

type Exam = {
  id: string;
  title: string;
  desc: string;
  questions: Array<Question>;
  proctored?: boolean;
};

type Message = {
  id: string;
  recipient: string;
  targetId: string;
  content: string;
};

const exam: Exam = {
  id: "1",
  title: "Prov",
  desc: "Prov i Programmering 1",
  proctored: false,
  questions: [
    {
      id: "1",
      title: "Uppgif 1",
      type: "code",
      value: 'print("Hello world")',
      desc: "Här ska du ändra så att den frågar efter en tal och skriver ut fakulteten för talet.",
    },
    {
      id: "2",
      title: "Uppgift 2",
      type: "text",
      value: "",
      desc: "Skriv pseudokod för hur man adderar 10 på varandra följande tal.",
    },
  ],
};

export function Exam({ proctoring }: { proctoring?: boolean }) {
  if (proctoring || exam.proctored) {
    return <ProctoredExam {...exam} />;
  }
  return (
    <PythonProvider>
      <EditorProvider>
        <ExamInner {...exam} />
      </EditorProvider>
    </PythonProvider>
  );
}

const ProctoredExam = (exam: Exam) => {
  const examRef = useRef<HTMLDivElement>(null);
  const [examHasStarted, setExamHasStarted] = useState(false);
  const { fullScreen, tabFocus } = useProctoring({
    element: examRef.current,
    preventTabSwitch: true,
    forceFullScreen: true,
    preventContextMenu: true,
    preventCopy: true,
  });

  useEffect(() => {
    if (examRef.current) {
      examRef.current.focus();
    }
  });
  const showPause =
    examHasStarted &&
    (fullScreen.status === "off" || tabFocus.status === false);
  console.log(examHasStarted, fullScreen.status, tabFocus.status);

  return (
    <div ref={examRef} id="fullscreen">
      <PythonProvider>
        {!examHasStarted && (
          <Message>
            <h3>Du har inte startat provet än.</h3>
            <button
              onClick={(ev) => {
                fullScreen.trigger();
                setExamHasStarted(true);
              }}
            >
              Starta
            </button>
          </Message>
        )}
        {showPause && (
          <Message>
            <h3>Pausat!</h3>
            <button
              onClick={(ev) => {
                fullScreen.trigger();
                setExamHasStarted(true);
              }}
            >
              Fortsätt
            </button>
          </Message>
        )}
        {examHasStarted && !showPause && <ExamInner {...exam} />}
      </PythonProvider>
    </div>
  );
};

const ExamInner = (exam: Exam) => {
  const [data, setData] = useState<Array<Answer>>(
    exam.questions.map((e) => ({ id: e.id, value: e.value }))
  );

  const [showTools, setShowTools] = useState(false);

  const onChange = (ans: Answer) => {
    setData((d) => [...d.filter((a) => a.id !== ans.id), ans]);
  };

  console.log(compressToUTF16(JSON.stringify(data)));

  return (
    <MainWrapper>
      <h1>{exam.title}</h1>
      <Card>
        <p>{exam.desc}</p>
      </Card>
      <Button onClick={() => setShowTools(!showTools)}>Show tools</Button>
      <Columns>
        <Questions style={{ width: showTools ? "40%" : "100%" }}>
          {exam.questions.map((q) =>
            q.type === "code" ? (
              <CodeEditor key={q.id} question={q} onChange={onChange} />
            ) : (
              <EditorProvider>
                <TextEditor key={q.id} question={q} onChange={onChange} />
              </EditorProvider>
            )
          )}
        </Questions>
        <Tools style={{ width: showTools ? "100%" : "40%" }}>
          <EditorProvider>
            <TextEditor
              question={{
                title: "Anteckningar",
                desc: "Här kan du skriva dina anteckningar",
                value: "",
                id: "notes",
                type: "text",
              }}
              onChange={onChange}
            />
          </EditorProvider>
          <Console />
        </Tools>
      </Columns>
    </MainWrapper>
  );
};

const Message = styled.div`
  border-radius: var(--border-radius);
  padding: 1rem;
  margin: 0 auto;
`;

const MainWrapper = styled.div`
  margin: 0 auto;
  // max-width: 100ch;
  padding: 2rem;
  background-color: var(--clr-page-bg);
  h1 {
    font-size: 38pt;
    margin-top: 0;
    border-bottom: 4pt dotted currentColor;
    color: white;
    font-weight: bold;
    filter: drop-shadow(1pt 1pt 2pt var(--clr-bg));
  }
`;

const Columns = styled.div`
  display: flex;
  gap: 1em;
`;

const Questions = styled.div``;

const Tools = styled.div`
  width: var(--toolWidth, 40%);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  margin: 1em 0;
  padding: 0 1em;
  overflow: hidden;
  background-color: var(--clr-editor-bg);
  color: white;
`;
