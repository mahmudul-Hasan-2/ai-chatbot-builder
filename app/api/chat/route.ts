import { groq } from "@/lib/groq";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { botId, messages, sessionId } = await req.json();

    const bot = await prisma.chatbot.findUnique({
      where: { id: botId },
      include: { knowledgeFiles: true },
    });

    if (!bot || !bot.isPublic) {
      return NextResponse.json(
        { error: "Bot not found or private" },
        { status: 404 },
      );
    }

    // Build context with knowledge base if files exist
    let knowledgeContext = "";
    if (bot.knowledgeFiles.length > 0) {
      knowledgeContext =
        "\n\nKnowledge Base:\n" +
        bot.knowledgeFiles
          .map((f) => f.content)
          .filter(Boolean)
          .join("\n---\n");
    }

    const systemMessage = {
      role: "system",
      content: `${bot.systemPrompt}${knowledgeContext}`,
    };

    const formattedMessages = [
      systemMessage,
      ...messages.map((m: any) => ({
        role: m.role === "model" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const stream = await groq.chat.completions.create({
      model: bot.model || "llama-3.3-70b-versatile",
      messages: formattedMessages as any,
      temperature: bot.temperature,
      stream: true,
    });

    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(customReadable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process chat" },
      { status: 500 },
    );
  }
}
