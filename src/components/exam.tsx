import { useEffect, useRef, useState } from "react";

import { PythonProvider } from "react-py";
import { Answer, Exam } from "../types";
import { CodeEditor } from "./editor";
import { TextEditor } from "./texteditor";
import { DrawingEditor } from "./drawingeditor";
import { useProctoring } from "../hooks/useProctoring";
import styled from "styled-components";
import { Card } from "../ui/card";
import Console from "./console";
import { EditorProvider } from "react-simple-wysiwyg";
import { compressToUTF16, decompressFromUTF16 } from "lz-string";
import { Button } from "../ui/button";
import { Columns as ColumnsIcon, Send } from "react-feather";
import { MainWrapper } from "./wrapper.style";
import { Columns } from "../ui/columns";
import { Message } from "../ui/messge";

export function PyExam({ proctoring }: { proctoring?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<Exam>();

  const url = new URL(window.location.href);
  const session = url.searchParams.get("id") || "";

  useEffect(() => {
    if (url.searchParams.get("id")) {
      fetch("api.php?id=" + session)
        .then((resp) => resp.json())
        .then((resp) => {
          setExam(resp);
          setLoading(false);
        });
    }
  }, []);

  if (loading || !exam) return <Message>Laddar...</Message>;

  if (proctoring || exam.proctored) {
    return <ProctoredExam exam={exam} session={session} />;
  }
  return (
    <PythonProvider>
      <EditorProvider>
        <ExamInner exam={exam} session={session} />
      </EditorProvider>
    </PythonProvider>
  );
}

const ProctoredExam = ({ exam, session }: { exam: Exam; session: string }) => {
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
        {examHasStarted && !showPause && (
          <ExamInner exam={exam} session={session} />
        )}
      </PythonProvider>
    </div>
  );
};

const ExamInner = ({ exam, session }: { exam: Exam; session: string }) => {
  const [data, setData] = useState<Array<Answer>>(() => {
    const localData = window.localStorage.getItem(`py-exam:${exam.id}`);
    if (localData) {
      return JSON.parse(decompressFromUTF16(localData));
    } else {
      return exam.questions.map((e) => ({ id: e.id, value: e.value }));
    }
  });

  const [images, setImages] = useState<Answer[]>([]);

  const [questions, setQuestions] = useState(() =>
    exam.questions.map((q) => ({
      ...q,
      ...data.find((d) => d.id === q.id),
    }))
  );

  const [showTools, setShowTools] = useState(false);
  const [submitted, setSubmitted] = useState(exam.submitted);

  const saverRef = useRef<number>();
  const contentRef = useRef("");

  const submit = () => {
    if (window.confirm("Är du säker på att du vill lämna in?")) {
      fetch("api.php", {
        method: "POST",
        body: JSON.stringify({
          action: "submit",
          exam: { ...exam, questions: data },
          session,
          images,
        }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp) {
            window.localStorage.removeItem(`py-exam:${session}`);
          }
          setSubmitted(resp);
        });
    }
  };

  const localSave = () => {
    if (contentRef.current) {
      window.localStorage.setItem(`py-exam:${session}`, contentRef.current);
    }
  };

  const onChange = (ans: Answer) => {
    const newData = [...data.filter((a) => a.id !== ans.id), ans];
    setData((d) => newData);
    contentRef.current = compressToUTF16(JSON.stringify(newData));

    clearTimeout(saverRef.current);
    saverRef.current = setTimeout(() => triggerSave(), 1000) as any;
  };

  const onChangeStatic = (ans: Answer) => {
    setImages((images) => [...images.filter((a) => a.id !== ans.id), ans]);
  };

  const triggerSave = () => {
    clearTimeout(saverRef.current);
    localSave();
    fetch("api.php", {
      method: "POST",
      body: JSON.stringify({
        action: "progress",
        data: contentRef.current,
        session,
      }),
    });
  };

  return (
    <MainWrapper>
      <h1>{exam.title}</h1>
      <Card>
        <p>{exam.desc}</p>
      </Card>
      <div className="flex">
        <Button
          style={{ marginLeft: "auto", marginTop: "1em" }}
          onClick={() => setShowTools(!showTools)}
        >
          <ColumnsIcon /> Växla kolumner
        </Button>
      </div>
      {submitted ? (
        <Message>Inlämnad</Message>
      ) : (
        <>
          <Columns>
            <Questions style={{ width: showTools ? "40%" : "100%" }}>
              {questions.map((q) => {
                switch (q.type) {
                  case "code":
                    return (
                      <CodeEditor key={q.id} question={q} onChange={onChange} />
                    );
                  case "drawing":
                    return (
                      <DrawingEditor
                        key={q.id}
                        question={q}
                        onChange={onChangeStatic}
                      />
                    );
                  default:
                    return (
                      <EditorProvider>
                        <TextEditor
                          key={q.id}
                          question={q}
                          onChange={onChange}
                        />
                      </EditorProvider>
                    );
                }
              })}
            </Questions>
            <Tools style={{ width: showTools ? "100%" : "40%" }}>
              <EditorProvider>
                <TextEditor
                  question={{
                    title: "Anteckningar",
                    desc: "Här kan du skriva dina anteckningar",
                    value: "",
                    id: "notes-text",
                    type: "text",
                  }}
                  onChange={onChange}
                />
              </EditorProvider>
              <CodeEditor
                question={{
                  title: "Testkod",
                  desc: "Här kan du testköra kod",
                  value: "",
                  id: "notes-code",
                  type: "code",
                }}
                onChange={onChange}
              />
              <Console />
            </Tools>
          </Columns>
          <div className="flex middle" style={{ margin: "1em" }}>
            <Button className="large" onClick={() => submit()}>
              <Send size={32} />
              Lämna in
            </Button>
          </div>
        </>
      )}
    </MainWrapper>
  );
};

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

  display: flex;
  flex-direction: column;
`;
