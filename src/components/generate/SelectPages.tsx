import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
import { SetStateAction, Dispatch } from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";

interface Props {
  pages: PageObjectResponse[];
  selectedPages: PageObjectResponse[];
  setSelectedPages: Dispatch<SetStateAction<PageObjectResponse[]>>;
  setSlide: Dispatch<SetStateAction<number>>;
}

export default function SelectPages({
  pages,
  selectedPages,
  setSelectedPages,
  setSlide,
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

  const nextSlide = () => {
    setSlide(1);
  };

  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <div className="bg-white rounded-xl px-10 py-8">
        <p className="text-center mb-4 text-lg">
          Select pages to make a flashcard set with:
        </p>
        <CheckboxGroup colorScheme="pink" size="lg">
          <Stack spacing="10px">
            {pages
              ? pages.map((page, index) => {
                  if (page.properties.title.type === "title") {
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
      <button onClick={nextSlide} className="mt-6">
        <div className="flex flex-row items-center">
          <p className="mr-1">Next</p>
          <ChevronRightIcon boxSize={5} />
        </div>
      </button>
    </div>
  );
}
