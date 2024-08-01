interface Props {
  question: string;
  answer: string;
}

export default function Card({ question, answer }: Props) {
  return (
    <div className="flex flex-row p-8 border-2 border-slate-200 justify-between items-center rounded-xl bg-white text-center">
      <p className="min-w-[40%] max-w-[40%] text-lg font-medium text-left">
        {question}
      </p>
      <p className="min-w-[55%] max-w-[55%] text-lg font-medium text-left">
        {answer}
      </p>
    </div>
  );
}
