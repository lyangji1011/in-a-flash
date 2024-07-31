// import { Flashcard } from "@prisma/client";
// import { Divider } from "@chakra-ui/react";

interface Props {
  question: string;
  answer: string;
}

export default function Card({ question, answer }: Props) {
  return (
    <div className="flex flex-row p-4 border-2 border-slate-200 flex flex-col justify-center items-center rounded-xl bg-white text-center">
      <p className="text-lg font-medium">{question}</p>
      {/* <Divider orientation="vertical" /> */}
      <p className="text-lg font-medium">{answer}</p>
    </div>
  );
}
