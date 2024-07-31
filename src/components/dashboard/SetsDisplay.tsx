import { FlashcardSet } from "@prisma/client";
import SetCard from "./SetCard";

interface Props {
  sets: FlashcardSet[];
}

export default function SetsDisplay({ sets }: Props) {
  return (
    <div>
      {sets.map((set) =>
        set.name ? <SetCard key={set.id} name={set.name} id={set.id} /> : null
      )}
    </div>
  );
}
