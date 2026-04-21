import { NextResponse } from "next/server";
import { z } from "zod";

import { agent, getFinalTextContent } from "@/lib/agent";

export const runtime = "nodejs";

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
 
  try {
    const body = await request.json();
    const { messages } = requestSchema.parse(body);

    const result = await agent.invoke({ messages });
    const lastMessage = result.messages.at(-1);
    console.log(123,result);
    const output = getFinalTextContent(lastMessage?.content);

    return NextResponse.json({ output });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "服务端发生未知错误。";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 400 },
    );
  }
}
