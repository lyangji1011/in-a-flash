import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { FlashcardSet } from "@prisma/client";
import { User } from "@/utils/types";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import SelectPages from "@/components/generate/SelectPages";
import NameSet from "@/components/generate/NameSet";

export default function generate() {
  const router = useRouter();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [pages, setPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState<PageObjectResponse[]>([]);
  // const [slide, setSlide] = useState(0);
  const [slide, setSlide] = useState(2);
  const [set, setSet] = useState<FlashcardSet>();
  const [setName, setSetName] = useState("");

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
        router.push("/enter");
        console.log(e);
      }
    }

    verifyUser();
  }, []);

  useEffect(() => {
    async function getPages() {
      if (user) {
        try {
          const response = await fetch(`/api/notion/search`);
          const data = await response.json();
          console.log(data.data);
          setPages(
            data.data.filter((page: PageObjectResponse) => {
              return page.created_by.id === user.id;
            })
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    if (user) {
      getPages();
    }
  }, [user]);

  switch (slide) {
    case 0:
    case 1:
      if (set) {
        return (
          <div>
            <Header name={user?.firstName} />
            <SelectPages
              pages={pages}
              selectedPages={selectedPages}
              setSelectedPages={setSelectedPages}
              slide={slide}
              setSlide={setSlide}
              setSet={setSet}
            />
          </div>
        );
      } else {
        router.push("/error");
      }
    case 2:
      if (set) {
        <div>
          <Header name={user?.firstName} />
          <NameSet
            set={set}
            setName={setName}
            setSetName={setSetName}
            setSlide={setSlide}
          />
        </div>;
      } else {
        router.push("/error");
      }
    // case 3:
    //   router.push(`/set/${set.id}`);
  }
}
