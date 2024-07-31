import { Flashcard } from "@prisma/client";
import Card from "./Card";

interface Props {
  cards: Flashcard[];
}

export default function SetsDisplay({ cards }: Props) {
  return (
    <div>
      <div className="flex flex-col flex-wrap	justify-start gap-6">
        {cards.map((card: Flashcard) => {
          return <Card question={card.question} answer={card.answer} />;
        })}
      </div>
    </div>
  );
}
