import { useEffect, useState } from "react";
import { User } from "@/utils/types/User";
import { useRouter } from "next/router";
import Header from "@/components/Header";

export default function Home() {
  const [user, setUser] = useState<User | undefined>(undefined);
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

  return (
    <div>
      <Header name={user?.firstName} />
    </div>
  );
}
