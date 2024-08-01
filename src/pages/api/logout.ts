import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const token: string = req.body.token;
    console.log(token);
    try {
      const deleted = await prisma.token.create({
        data: {
          token: token,
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e });
    }
    return res.status(200).json({ status: "success" });
  } else {
    return res.status(400);
  }
}
