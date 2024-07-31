import { useRouter } from "next/router";

interface Props {
  name: string;
  id: number;
}

export default function SetCard({ name, id }: Props) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/set/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border-2 border-slate-200 flex flex-col justify-center items-center rounded-xl h-48 w-64 bg-white hover:cursor-pointer text-center"
    >
      <p className="text-lg font-medium	p-4">{name}</p>
    </div>
  );
}
