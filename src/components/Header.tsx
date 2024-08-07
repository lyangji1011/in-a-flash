import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

interface Props {
  name: string | undefined;
}

export default function Header({ name }: Props) {
  const router = useRouter();
  const handleSignOut = async () => {
    const response = await fetch("/api/auth/verify");
    const token = await response.json();
    console.log(token.token);
    await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token.token,
      }),
    });
    router.push("/enter");
  };

  const toDashboard = () => {
    router.push("/");
  };

  return (
    <div className="z-50 bg-white fixed flex flex-row w-full py-4 justify-between px-[8vw] md:px-[13vw] border-b-2 border-slate-200">
      <div className="hover:cursor-pointer">
        <Image
          onClick={toDashboard}
          src="/logo.png"
          alt="logo"
          width={160}
          height={18}
        />
      </div>
      <div className="flex flex-row align-center">
        {name ? <p>Hey, {name}!</p> : null}
        <button
          onClick={handleSignOut}
          className="ml-5 rounded-md px-2.5 bg-slate-200 transition-colors duration-300 ease-in-out hover:bg-slate-300"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
