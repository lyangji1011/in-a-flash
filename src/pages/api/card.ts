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

    pageIds.forEach(async (pageId: string) => {
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
    });

    // connect to openai and prompt with content
    return res.status(200).json({ data: content });
  } else {
    return res.status(400);
  }
}
