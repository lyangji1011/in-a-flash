import Image from "next/image";
import { useRouter } from "next/router";

export default function NoSets() {
  const router = useRouter();

  const createSet = () => {
    router.push("/generate");
  };

  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <p className="text-center text-zinc-500 text-xl">
        You don't have any sets!
      </p>
      <p className="text-center text-zinc-500 text-xl">
        Create your first set by clicking below:
      </p>
      <Image
        onClick={createSet}
        className="mt-4 hover:cursor-pointer"
        src="/plus.png"
        alt="create-set"
        height={44}
        width={44}
      />
    </div>
  );
}
