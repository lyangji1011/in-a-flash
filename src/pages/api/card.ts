import { NextApiRequest, NextApiResponse } from "next";
import {
  BulletedListItemBlockObjectResponse,
  CalloutBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  NumberedListItemBlockObjectResponse,
  PageObjectResponse,
  ParagraphBlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Client } from "@notionhq/client";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import OpenAI from "openai";
import prisma from "@/utils/prisma";
import { Flashcard } from "@prisma/client";

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
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (typeof decoded === "string") {
      return res.status(500);
    }

    const userId = decoded.id;
    const notion = new Client({ auth: decoded.accessToken });
    const pageIds = req.body.pages.map((page: PageObjectResponse) => {
      return page.id;
    });

    let content: string[] = [];
    const validTypes = [
      "bulleted_list_item",
      "callout",
      "heading_1",
      "heading_2",
      "heading_3",
      "numbered_list_item",
      "paragraph",
    ];

    for (const pageId of pageIds) {
      const page = await notion.blocks.children.list({
        block_id: pageId,
      });
      let pageContent: string = "";
      page.results.forEach((block) => {
        if ("type" in block && validTypes.includes(block.type)) {
          let richText: RichTextItemResponse[] = [];
          switch (block.type) {
            case "bulleted_list_item":
              const bulletedListItem =
                block as BulletedListItemBlockObjectResponse;
              richText = bulletedListItem.bulleted_list_item.rich_text;
              break;
            case "callout":
              const callout = block as CalloutBlockObjectResponse;
              richText = callout.callout.rich_text;
              break;
            case "heading_1":
              const heading1 = block as Heading1BlockObjectResponse;
              richText = heading1.heading_1.rich_text;
              break;
            case "heading_2":
              const heading2 = block as Heading2BlockObjectResponse;
              richText = heading2.heading_2.rich_text;
              break;
            case "heading_3":
              const heading3 = block as Heading3BlockObjectResponse;
              richText = heading3.heading_3.rich_text;
              break;
            case "numbered_list_item":
              const numberedListItem =
                block as NumberedListItemBlockObjectResponse;
              richText = numberedListItem.numbered_list_item.rich_text;
              break;
            case "paragraph":
              const paragraph = block as ParagraphBlockObjectResponse;
              richText = paragraph.paragraph.rich_text;
              break;
          }
          richText.forEach((item) => {
            if ("text" in item) {
              pageContent += item.text.content + " ";
            }
          });
        }
      });
      if (pageContent) {
        content.push(pageContent);
      }
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let flashcards = [];
    const prompt =
      'Provided is a paragraph of notes. Your task is to create flashcards from this paragraph. Create a list [] of JSON-style objects in the form {"question": <question>, "answer": <answer>} from the paragraph. Do not actually convert to JSON, leave your response as a string where JSON.parse() can be used directly.';
    for (const page of content) {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: `${prompt}. \n\n ${page}` }],
        model: "gpt-4o-mini",
      });
      if (completion.choices[0].message.content) {
        const data = JSON.parse(completion.choices[0].message.content);
        flashcards.push(...data);
      }
    }

    const set = await prisma.flashcardSet.create({
      data: {
        flashcards: {
          create: [],
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    let result: Flashcard[] = [];
    for (const bareCard of flashcards) {
      const card = await prisma.flashcard.create({
        data: {
          question: bareCard.question,
          answer: bareCard.answer,
          set: {
            connect: {
              id: set.id,
            },
          },
        },
      });
      result.push(card);
    }

    return res.status(200).json({ cards: result });
  } else if (req.method === "GET") {
    if (req.query.setId) {
      const setId = Array.isArray(req.query.setId)
        ? req.query.setId[0]
        : req.query.setId;
      const cards = await prisma.flashcard.findMany({
        where: {
          setId: parseInt(setId),
        },
      });
      return res.status(200).json({ data: cards });
    } else {
      return res.status(400);
    }
  } else {
    return res.status(400);
  }
}
