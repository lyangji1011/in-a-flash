import { useRouter } from "next/router";

export default function error() {
  const router = useRouter();

  const redirect = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="border-2 border-slate-200 rounded-xl bg-white flex flex-col items-center py-16 px-16 justify-center">
        <p className="font-medium	text-lg mb-1">Oops, something went wrong!</p>
        <p className="cursor-pointer" onClick={redirect}>
          Click to return to dashboard
        </p>
      </div>
    </div>
  );
}
