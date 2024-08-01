import jwt from "jsonwebtoken";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      return res.status(401).json({ error: "Unable to verify user" });
    }
    const cookies = cookie.parse(req.headers.cookie ? req.headers.cookie : "");
    const token = cookies.jwt;

    const deleted = await prisma.token.findFirst({
      where: {
        token: token,
      },
    });
    console.log(deleted);
    if (deleted) {
      return res.status(401).json({ erorr: "Unauthorized access" });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return res.status(200).json({ info: decoded });
    } catch (error) {
      return res.status(401).json({ error: error });
    }
  } else if (req.method === "GET") {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      return res.status(401).json({ error: "Unable to verify user" });
    }
    const cookies = cookie.parse(req.headers.cookie ? req.headers.cookie : "");
    const token = cookies.jwt;
    return res.status(200).json({ token: token });
  } else {
    return res.status(400);
  }
}
