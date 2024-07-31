import { Dispatch, SetStateAction } from "react";
import { Input } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import { Flashcard, FlashcardSet } from "@prisma/client";

interface Props {
  set: FlashcardSet;
  setName: string;
  setSetName: Dispatch<SetStateAction<string>>;
  setSlide: Dispatch<SetStateAction<number>>;
}

export default function NameSet({ set, setName, setSetName, setSlide }: Props) {
  const toast = useToast();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSetName(event.target.value);
  };

  const nextSlide = async () => {
    if (setName.length === 0) {
      toast({
        title: "Missing name.",
        description: "Please name this flashcard set before moving on.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
      const response = await fetch("/api/card", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: set.id, // TODO: change this to pass in the set id, not the card id
          name: setName,
        }),
      });
      const data = await response.json();
      setSlide(3);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <p className="text-lg">Your flashcard set is complete!</p>
      <p className="mb-8 text-lg">Now give it a name:</p>
      <div className="w-[25%]">
        <Input
          size="lg"
          value={setName}
          onChange={handleChange}
          style={{ backgroundColor: "white", textAlign: "center" }}
        />
      </div>
      <button onClick={nextSlide} className="mt-6">
        <div className="flex flex-row items-center">
          <p className="mr-1">Next</p>
          <ChevronRightIcon boxSize={5} />
        </div>
      </button>
    </div>
  );
}
