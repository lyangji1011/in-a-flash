import { useRouter } from "next/router";

interface Props {
  name: string;
  id: number;
}

export default function SetCard({ name, id }: Props) {
  const router = useRouter();
  const handleClick = () => {};

  return (
    <div>
      {name} {id}
    </div>
  );
}
