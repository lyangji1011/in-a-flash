import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    console.log(req.body.id);
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
    if (req.query.userId) {
      const userId = Array.isArray(req.query.userId)
        ? req.query.userId[0]
        : req.query.userId;
      const sets = await prisma.flashcardSet.findMany({
        where: {
          userId: userId,
        },
      });
      return res.status(200).json({ data: sets });
    } else if (req.query.setId) {
      const setId = Array.isArray(req.query.setId)
        ? req.query.setId[0]
        : req.query.setId;
      const set = await prisma.flashcardSet.findFirst({
        where: {
          id: parseInt(setId),
        },
      });
      if (!set) {
        return res.status(404).json({ error: "Set not found" });
      }
      return res.status(200).json({ data: set });
    } else {
      return res.status(400);
    }
  } else if (req.method === "DELETE") {
    if (req.query.setId) {
      try {
        const setId = Array.isArray(req.query.setId)
          ? req.query.setId[0]
          : req.query.setId;
        const deleteCards = prisma.flashcard.deleteMany({
          where: {
            setId: parseInt(setId),
          },
        });
        const deleteSet = prisma.flashcardSet.delete({
          where: {
            id: parseInt(setId),
          },
        });
        const transaction = await prisma.$transaction([deleteCards, deleteSet]);
        return res.status(200).json({ data: transaction });
      } catch (e) {
        console.log(e);
        return res.status(500);
      }
    } else {
      return res.status(400);
    }
  } else {
    return res.status(400);
  }
}
