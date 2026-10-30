import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const botId = searchParams.get("botId");

  if (!botId)
    return NextResponse.json({ error: "Missing botId" }, { status: 400 });

  const bot = await prisma.chatbot.findUnique({
    where: { id: botId },
    select: {
      name: true,
      description: true,
      welcomeMessage: true,
      isPublic: true,
    },
  });

  if (!bot || !bot.isPublic) {
    return NextResponse.json(
      { error: "Bot not found or private" },
      { status: 404 },
    );
  }

  return NextResponse.json({ bot });
}
