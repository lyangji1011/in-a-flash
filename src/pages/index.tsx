import { useEffect, useState } from "react";
import { User } from "@/utils/types";
import { useRouter } from "next/router";
import NoSets from "@/components/dashboard/NoSets";
import SetsDisplay from "@/components/dashboard/SetsDisplay";
import Header from "@/components/Header";
import { Button, Input } from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { FlashcardSet } from "@prisma/client";

export default function Home() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [sets, setSets] = useState([]);
  const [filteredSets, setFilteredSets] = useState([]);
  const [filter, setFilter] = useState("");
  const router = useRouter();

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
      }
    }

    verifyUser();
  }, []);

  useEffect(() => {
    async function fetchSets() {
      try {
        const response = await fetch(`/api/set?userId=${user?.id}`, {
          method: "GET",
        });
        const data = await response.json();
        console.log(data);
        setSets(data.data);
        setFilteredSets(data.data);
      } catch (e) {
        console.log(e);
      }
    }

    if (user) {
      fetchSets();
    }
  }, [user]);

  const updateFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const applyFilter = () => {
    console.log(filter);
    if (filter.length === 0) {
      setFilteredSets(sets);
    } else {
      setFilteredSets(
        sets.filter((set: FlashcardSet) => {
          if (set.name) {
            return set.name?.toLowerCase().includes(filter.toLowerCase());
          }
          return false;
        })
      );
    }
  };

  const createSet = () => {
    router.push("/generate");
  };

  return (
    <div>
      <Header name={user?.firstName} />
      {sets.length === 0 ? (
        <NoSets />
      ) : (
        <div className="mx-[8vw] md:mx-[13vw] py-28">
          <h1 className="text-5xl	font-poppins font-medium mb-3 font-sans">
            Your sets
          </h1>
          <div className="mb-10 flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-start w-[350px] md:w-[400px] lg:w-[500px]">
              <Input
                value={filter}
                borderRadius={11}
                style={{ backgroundColor: "white" }}
                onChange={updateFilter}
              />
              <SearchIcon
                boxSize={6}
                marginLeft="18px"
                color="#22206D"
                _hover={{
                  cursor: "pointer",
                }}
                onClick={applyFilter}
              />
            </div>
            <Button
              rightIcon={<AddIcon />}
              onClick={createSet}
              colorScheme="pink"
              variant="solid"
            >
              Create
            </Button>
          </div>
          <SetsDisplay sets={filteredSets} />
        </div>
      )}
    </div>
  );
}
