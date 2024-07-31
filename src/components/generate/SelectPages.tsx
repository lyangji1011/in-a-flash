import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Checkbox, CheckboxGroup, Spinner, Stack } from "@chakra-ui/react";
import { SetStateAction, Dispatch } from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { FlashcardSet } from "@prisma/client";

interface Props {
  pages: PageObjectResponse[];
  selectedPages: PageObjectResponse[];
  setSelectedPages: Dispatch<SetStateAction<PageObjectResponse[]>>;
  slide: number;
  setSlide: Dispatch<SetStateAction<number>>;
  setSet: Dispatch<SetStateAction<FlashcardSet | undefined>>;
}

export default function SelectPages({
  pages,
  selectedPages,
  setSelectedPages,
  slide,
  setSlide,
  setSet,
}: Props) {
  const handleClick = (page: PageObjectResponse) => {
    if (selectedPages.includes(page)) {
      setSelectedPages(
        selectedPages.filter((sPage) => {
          return sPage !== page;
        })
      );
    } else {
      setSelectedPages([...selectedPages, page]);
    }
  };

  const generate = async () => {
    setSlide(1);
    console.log("generating");
    const response = await fetch("/api/card", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pages: selectedPages,
      }),
    });
    const data = await response.json();
    setSet(data.cards);
    setSlide(2);
  };

  if (slide === 0) {
    return (
      <div className="flex flex-col justify-center min-h-screen items-center py-20">
        <div className="bg-white rounded-xl px-10 py-8">
          <p className="text-center mb-4 text-lg">
            Select pages to make a flashcard set with:
          </p>
          <CheckboxGroup colorScheme="pink" size="lg">
            <Stack spacing="10px">
              {pages
                ? pages.map((page, index) => {
                    if (
                      page.properties.title &&
                      page.properties.title.type === "title"
                    ) {
                      return (
                        <Checkbox
                          iconSize="lg"
                          onChange={() => handleClick(page)}
                          key={index}
                        >
                          {page.properties.title.title[0].plain_text}
                        </Checkbox>
                      );
                    }
                  })
                : null}
            </Stack>
          </CheckboxGroup>
        </div>
        <button onClick={generate} className="mt-6">
          <div className="flex flex-row items-center">
            <p className="mr-1">Next</p>
            <ChevronRightIcon boxSize={5} />
          </div>
        </button>
      </div>
    );
  } else if (slide === 1) {
    return (
      <div className="flex flex-col justify-center min-h-screen items-center">
        <p className="mb-6 text-lg">Your flashcard set is being generated</p>
        <Spinner />
      </div>
    );
  }
}
