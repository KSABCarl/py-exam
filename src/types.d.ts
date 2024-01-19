export type Question = {
  id: string;
  title: string;
  type: "code" | "text";
  value: string;
  desc: string;
};

export type Answer = {
  id: string;
  value: string;
};
