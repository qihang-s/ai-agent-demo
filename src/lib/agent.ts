import { ChatOpenAI } from "@langchain/openai";
import { createAgent, tool } from "langchain";
import { z } from "zod";

const getCurrentTime = tool(
  async ({ timezone }) => {
    console.log(456,timezone);

    const now = new Date();
    return new Intl.DateTimeFormat("zh-CN", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: timezone,
    }).format(now);
  },
  {
    name: "get_current_time",
    description: "获取指定时区的当前日期和时间。",
    schema: z.object({
      timezone: z
        .string()
        .describe("IANA 时区，例如 Asia/Shanghai 或 America/New_York"),
    }),
  },
);

const calculate = tool(
  async ({ expression }) => {
    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
      throw new Error("表达式只能包含数字和 + - * / ( ) .");
    }

    const value = Function(`\"use strict\"; return (${expression});`)();
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error("表达式未计算出有效数字。");
    }

    return String(value);
  },
  {
    name: "calculate",
    description: "计算数学表达式。",
    schema: z.object({
      expression: z.string().describe("数学表达式，例如 (20 + 3) * 5 / 2"),
    }),
  },
);

const llm = new ChatOpenAI({
  model: process.env.VIVGRID_MODEL ?? "gpt-4o-mini",
  apiKey: process.env.VIVGRID_API_KEY,
  configuration: {
    baseURL: process.env.VIVGRID_BASE_URL ?? "https://api.vivgrid.com/v1",
  },
});

export const agent = createAgent({
  model: llm,
  tools: [getCurrentTime, calculate],
  systemPrompt:
    "你是一个务实的助手。只在能提升准确性时调用工具。回答要简洁并可执行。",
});

export function getFinalTextContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const text = content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (
          typeof part === "object" &&
          part !== null &&
          "text" in part &&
          typeof (part as { text?: unknown }).text === "string"
        ) {
          return (part as { text: string }).text;
        }
        return "";
      })
      .join("\n")
      .trim();

    if (text.length > 0) {
      return text;
    }
  }

  return "已完成执行，但未能提取到可显示的文本输出。";
}
