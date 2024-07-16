import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function Enter() {
  const router = useRouter();
  const notionAuthURL = process.env.NEXT_PUBLIC_NOTION_AUTH_URL;

  useEffect(() => {
    async function checkUser() {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/")
      } 
    }

    checkUser();
  }, []);

  const handleSignIn = () => {
    if (notionAuthURL) {
      router.push(notionAuthURL)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="border-2 border-slate-200 rounded-xl bg-white flex flex-col items-center py-16 px-16 justify-center">
        <Image 
          src="/logo.png"
          alt="In a Flash logo"
          width={440}
          height={0}
        />
        <h2 className="font-sans text-3xl text-center mt-2">notion to flashcards</h2>
        <button onClick={handleSignIn} className="border-2 border-black rounded-lg py-1 px-4 text-2xl font-sans mt-8 transition-colors duration-300 ease-in-out hover:text-[#DC59A0] hover:border-[#DC59A0]">Sign in with Notion</button>
      </div>
    </div>
  )
}