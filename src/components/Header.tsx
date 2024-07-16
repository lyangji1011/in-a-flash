import React from "react";
import Image from "next/image";

interface Props {
  name: string | undefined;
}

export default function Header({ name }: Props) {
  return (
    <div className="bg-white fixed flex flex-row w-full py-4 justify-between px-[8vw] md:px-[15vw] border-b-2 border-slate-200">
      <Image src="/logo.png" alt="logo" width={160} height={18} />
      <div className="flex flex-row align-center">
        <p>Hey, {name}!</p>
        <button className="ml-5 rounded-md px-2.5 bg-slate-200 transition-colors duration-300 ease-in-out hover:bg-slate-300">Sign out</button>
      </div>
    </div>
  )
}