import { NextRequest } from "next/server";
import { Groq } from "groq-sdk";
import { prisma } from "@/lib/prisma";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { botId, sessionId, messages } = await req.json();

    if (!botId || !messages || !Array.isArray(messages)) {
      return new Response("Missing botId or messages", { status: 400 });
    }

    // 1. Fetch Chatbot details
    const bot = await prisma.chatbot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      return new Response("Bot not found", { status: 404 });
    }

    // 2. Format System Prompt & User Messages
    const systemInstruction = {
      role: "system",
      content: bot.systemPrompt || "You are a helpful AI assistant.",
    };

    // Filter out welcome message or invalid IDs if needed, only pass standard role/content
    const validMessages = messages
      .filter((m: any) => m.content && m.content.trim() !== "")
      .map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

    const formattedMessages = [systemInstruction, ...validMessages];

    // 3. Save User Message to Database if Session exists
    const lastUserMsg = validMessages[validMessages.length - 1];
    if (sessionId && lastUserMsg && lastUserMsg.role === "user") {
      await prisma.chatMessage.create({
        data: {
          sessionId,
          role: "user",
          content: lastUserMsg.content,
        },
      });
    }

    // 4. Request Groq API Stream
    const groqResponse = await groq.chat.completions.create({
      messages: formattedMessages,
      model: bot.model || "openai/gpt-oss-120b",
      temperature: bot.temperature || 0.7,
      stream: true,
    });

    // 5. Stream output cleanly to frontend
    let fullAssistantResponse = "";
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of groqResponse) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullAssistantResponse += content;
              controller.enqueue(encoder.encode(content));
            }
          }

          // Save Assistant Message to DB after stream completes
          if (sessionId && fullAssistantResponse.trim()) {
            await prisma.chatMessage.create({
              data: {
                sessionId,
                role: "assistant",
                content: fullAssistantResponse,
              },
            });
          }
        } catch (err) {
          console.error("Stream processing error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
