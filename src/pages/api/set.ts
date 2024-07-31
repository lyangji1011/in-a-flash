import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    const set = await prisma.flashcardSet.update({
      where: {
        id: req.body.id,
      },
      data: {
        name: req.body.name,
      },
    });
    return res.status(200).json({ data: set });
  } else if (req.method === "GET") {
    const userId = Array.isArray(req.query.userId)
      ? req.query.userId[0]
      : req.query.userId;
    const sets = await prisma.flashcardSet.findMany({
      where: {
        userId: userId,
      },
    });
    return res.status(200).json({ data: sets });
  } else {
    return res.status(400);
  }
}
