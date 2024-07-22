import { Spinner } from "@chakra-ui/react";
import { useEffect } from "react";

export default function InProgress() {
  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <p className="mb-6 text-lg">Your flashcard set is being generated</p>
      <Spinner />
    </div>
  );
}
