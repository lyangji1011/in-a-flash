import Header from "@/components/Header";
import { User } from "@/utils/types";
import { FlashcardSet, Flashcard } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CardsDisplay from "@/components/setView/CardsDisplay";

export default function SetView() {
  const router = useRouter();
  const setId = router.query.id;
  const [set, setSet] = useState<FlashcardSet>();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    async function verifyUser() {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
        });
        if (!response.ok) {
          router.push("/enter");
        }
        const data = await response.json();
        setUser(data.info);
      } catch (e) {
        console.log(e);
        router.push("/error");
      }
    }

    verifyUser();
  }, []);

  useEffect(() => {
    async function fetchSet() {
      if (user) {
        try {
          const response = await fetch(`/api/set?setId=${setId}`, {
            method: "GET",
          });
          const data = await response.json();
          setSet(data.data);
        } catch (e) {
          console.log(e);
          router.push("/error");
        }
      }
    }

    fetchSet();
  }, [user]);

  useEffect(() => {
    async function fetchCards() {
      if (set) {
        console.log("HI");
        try {
          const response = await fetch(`/api/card?setId=${setId}`, {
            method: "GET",
          });
          const data = await response.json();
          console.log(data.data);
          setCards(data.data);
        } catch (e) {
          console.log(e);
          router.push("/error");
        }
      }
    }

    fetchCards();
  }, [set]);

  return (
    <div>
      <Header name={user?.firstName} />
      <div className="mx-[8vw] md:mx-[13vw] py-28">
        <h1 className="text-4xl	font-poppins font-medium mb-3 font-sans">
          {set?.name}
        </h1>
        <CardsDisplay cards={cards} />
      </div>
    </div>
  );
}
