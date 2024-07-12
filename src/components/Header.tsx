import React from "react";

interface Props {
  name: string | undefined;
}

export default function Header({ name }: Props) {
  return (
    <div>
      Hey, {name}!
    </div>
  )
}