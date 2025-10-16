
export type RawQuestion = {
  scope: string | null;
  content: string;
  type: 'single' | 'multiple';
  answers: string[]; // e.g., ['a','c']
  choices: Record<string, string>; // key:a..f -> text
};

export type Department = {
  id: string;
  name: string;
  scopes: string[];
};

export type DepartmentsPayload = {
  departments: Department[];
  allScopes: string[];
};

export type QuizChoice = { key: string; text: string };
export type QuizQuestion = {
  id: string;
  scope: string | null;
  content: string;
  type: 'single' | 'multiple';
  choices: QuizChoice[]; // shuffled
  correctKeys: Set<string>;
};
