export type Flashcard = {
  id: number;
  question: string;
  answer: string;
  setId: number;
};

export type User = {
  firstName: string;
  email: string;
  accessToken: string;
  id: string;
  iat: number;
};
