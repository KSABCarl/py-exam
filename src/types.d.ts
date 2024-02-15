export type Question = {
  id: string;
  title: string;
  type: "code" | "text" | "drawing";
  value: string;
  desc: string;
  p?: number;
  output?: "text" | "html";
  files?: Array<{ name: string; url: string }>;
};

export type Answer = {
  id: string;
  value: string;
};

export type Exam = {
  id: string;
  title: string;
  desc: string;
  questions: Array<Question>;
  proctored?: boolean;
  submitted?: number;
};

export type Message = {
  id: string;
  recipient: string;
  targetId: string;
  content: string;
};
