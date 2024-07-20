import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { User } from "@/utils/types/User";

export default function generate() {
  const router = useRouter();
  const [user, setUser] = useState<User | undefined>(undefined);

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

  useEffect(() => {
    async function getSets() {
      try {
        const response = await fetch(`/api/notion/search`);
        const data = await response.json();
        console.log(data);
      } catch(e) {
        console.log(e);
      }
    }

    if (user) {
      getSets();
    }
  }, [user])

  return (
    <div>
      {/* <Header name={user?.firstName} /> */}
      {user?.accessToken}
    </div>
  )
}