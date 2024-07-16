import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import type { BotUserObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import cookie from "cookie";
import prisma from "@/utils/prisma";

let refreshTokens = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const clientId = process.env.AUTH_CLIENT_ID;
    const clientSecret = process.env.AUTH_CLIENT_SECRET;

    const { code, error } = req.query;

    if (error) {
      res.redirect("/enter");
    }

    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST", 
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      }, 
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code, 
        redirect_uri: "http://localhost:3001/api/auth/callback",
      })
    })

    const data = await response.json();
    const userInfo = await getUserInfo(data.access_token);
    const tokens = generateJWT(data.access_token, userInfo);

    if (!tokens || !tokens.jwtToken || !tokens.refreshToken) {
      return res.status(500).json({ error: "JWT token could not be created"});
    }

    console.log("before");
    const x = await addUserToDB(userInfo);
    console.log("after")

    res.setHeader("Set-Cookie", cookie.serialize("jwt", tokens?.jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", 
      maxAge: 60 * 60, 
      sameSite: "lax", 
      path: "/"
    }))

    res.redirect("/");
  } catch (e) {
    return res.status(500).json({ error: e });
  }
}

async function addUserToDB(userInfo: BotUserObjectResponse) {
  if (userInfo.bot.owner.type === "user") {
    try {
      const firstName = userInfo.bot.owner.user.name?.split(" ")[0];
      const lastName = userInfo.bot.owner.user.name?.split(" ")[1];
      const email = userInfo.bot.owner.user.person.email;

      const user = await prisma.user.create({
        data: {
          firstName: firstName, 
          lastName: lastName, 
          email: email,
        }
      });

      return user
    } catch(e) {
      return false;
    }
  } else {
    return false;
  }
}

function generateJWT(accessToken: string, userInfo: BotUserObjectResponse) {
  if (userInfo.bot.owner.type === "user" && process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET) {
    const payload = {
      "firstName": userInfo.bot.owner.user.name?.split(" ")[0],
      "lastName": userInfo.bot.owner.user.name?.split(" ")[1],
      "email": userInfo.bot.owner.user.person.email,
      "accessToken": accessToken,
    }
    const jwtToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    return {jwtToken: jwtToken, refreshToken: refreshToken};
  }
  return null;
}

async function getUserInfo(accessToken: string) {
  const response = await fetch("https://api.notion.com/v1/users/me", {
    method: "GET",
    headers: {
      "Notion-Version": "2022-06-28",
      Authorization: `Bearer ${accessToken}`,
    }
  });

  return await response.json();
}
