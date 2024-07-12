import jwt from "jsonwebtoken";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("i'm here!!!")
  if (req.method === "POST") {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      return res.status(401).json({ error: "Unable to verify user" });
    }
    const cookies = cookie.parse(req.headers.cookie ? req.headers.cookie : "");
    console.log(cookies);
    const token = cookies.jwt;
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(decoded);
      return res.status(200).json({ info: decoded});
    } catch (error) {
      return res.status(401).json({ error: error});
    }
  }
}