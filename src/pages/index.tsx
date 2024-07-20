import { useEffect, useState } from "react";
import { User } from "@/utils/types/User";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [sets, setSets] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function verifyUser() {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST", 
        })
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
  }, [])

  const createSet = () => {
    router.push("/generate");
  }

  return (
    <div>
      <Header name={user?.firstName} />
      {
        sets.length === 0 ? 
          <div className="flex flex-col justify-center min-h-screen items-center">
            <p className="text-center text-zinc-500 text-xl">You don't have any sets!</p>
            <p className="text-center text-zinc-500 text-xl">Create your first set by clicking below:</p>
            <Image onClick={createSet} className="mt-4 hover:cursor-pointer" src="/plus.png" alt="create-set" height={44} width={44} />
          </div>
        :
          <div>
            <p>populate with sets</p>
          </div>
      }
    </div>
  );
}
