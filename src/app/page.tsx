"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const roleText: Record<ChatMessage["role"], string> = {
  user: "用户",
  assistant: "助手",
};

const quickPrompts = [
  "帮我计算 (1250 - 468) / 6",
  "告诉我 Asia/Shanghai 当前时间",
  "对比学习 TypeScript 和 JavaScript",
  "写一个 3 天的前端学习计划",
];

const starter: ChatMessage = {
  role: "assistant",
  content:
    "你好，我是你的 LangChain Agent 演示助手。你可以让我做计算、查询时区时间，或进行普通问答。",
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([starter]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  useEffect(() => {
    if (!listRef.current) {
      return;
    }
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) {
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const history = [...messages, userMessage];

    setMessages(history);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const payload = (await response.json()) as { output?: string; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "请求失败。");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: payload.output ?? "接口未返回可显示文本。",
        },
      ]);
    } catch (error) {
      const fallback = error instanceof Error ? error.message : "出现意外错误。";
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `错误：${fallback}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 md:px-10">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <section className="hero-panel relative mb-6 overflow-hidden rounded-3xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Next.js + LangChain Agent</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          可落地的前端智能体模板
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
          服务端运行 Agent，前端只负责交互。安全、清晰、可扩展，适合快速搭建业务助手。
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="tag">工具调用</span>
          <span className="tag">OpenAI 兼容</span>
          <span className="tag">Next.js App Router</span>
        </div>
      </section>

      <section className="chat-shell grid flex-1 gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="chat-panel flex min-h-[64vh] flex-col rounded-3xl p-4 md:p-6">
          <div ref={listRef} className="scroll-area flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <article
              key={`${message.role}-${index}`}
              className={`bubble ${
                message.role === "assistant" ? "bubble-assistant" : "bubble-user"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
                {roleText[message.role]}
              </p>
              <p className="mt-2 whitespace-pre-wrap leading-7">{message.content}</p>
            </article>
          ))}
            {loading ? (
              <div className="typing-row">
                <span>助手正在思考</span>
                <div className="typing-dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            ) : null}
          </div>

          <form className="mt-4 flex gap-2" onSubmit={onSubmit}>
            <input
              className="flex-1 rounded-2xl border border-slate-300/30 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200/70"
              placeholder="例如：查一下上海时间，再算 (12+8)*3"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button
              type="submit"
              className="send-button rounded-2xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!canSend}
            >
              发送
            </button>
          </form>
        </div>

        <aside className="side-panel rounded-3xl p-4 md:p-5">
          <h2 className="text-sm font-semibold text-slate-800">快捷问题</h2>
          <p className="mt-1 text-xs leading-5 text-slate-600">点击即可填入输入框，快速体验工具调用与问答能力。</p>
          <div className="mt-3 space-y-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="quick-item w-full rounded-2xl px-3 py-2 text-left text-sm"
                onClick={() => setInput(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white/70 p-3">
            <p className="text-xs font-semibold text-slate-700">当前能力</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              <li>- 时区时间查询</li>
              <li>- 数学表达式计算</li>
              <li>- 通用对话回答</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
