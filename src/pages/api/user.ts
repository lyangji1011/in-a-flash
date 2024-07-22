import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    return res.status(401).json({ error: "Unable to verify user" });
  }
  const cookies = cookie.parse(req.headers.cookie ? req.headers.cookie : "");
  const token = cookies.jwt;
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (typeof decoded === "string") {
      return res.status(500);
    }

    const notion = new Client({ auth: decoded.accessToken });
    const response = await notion.users.me({});
    if (response.type === "person") {
      return res.status(500);
    }
    if (response.bot.owner.type === "workspace") {
      return res.status(500);
    }
    return res.status(200).json({ data: response.bot.owner.user.id });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
}
