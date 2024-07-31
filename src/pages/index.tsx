import { useEffect, useState } from "react";
import { User } from "@/utils/types";
import { useRouter } from "next/router";
import NoSets from "@/components/dashboard/NoSets";
import SetsDisplay from "@/components/dashboard/SetsDisplay";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

export default function Home() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [sets, setSets] = useState([]);
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
      } catch (e) {
        console.log(e);
      }
    }

    if (user) {
      fetchSets();
    }
  }, [user]);

  return (
    <div>
      <Header name={user?.firstName} />
      {sets.length === 0 ? (
        <NoSets />
      ) : (
        <div className="mx-[8vw] md:mx-[13vw] py-24">
          <h1 className="text-5xl	font-poppins font-medium mb-3 font-sans">
            Your sets
          </h1>
          <div className="mb-10 flex flex-row items-center justify-start w-[350px] md:w-[400px] lg:w-[500px]">
            <Input borderRadius={11} style={{ backgroundColor: "white" }} />
            <Search2Icon boxSize={6} marginLeft="18px" />
          </div>
          <SetsDisplay sets={sets} />
        </div>
      )}
      <Footer />
    </div>
  );
}
