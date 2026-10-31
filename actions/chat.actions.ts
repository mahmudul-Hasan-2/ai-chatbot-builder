"use server";

import prisma from "@/lib/prisma";

// Create or fetch existing session
export async function getOrCreateChatSessionAction(botId: string, sessionId?: string) {
  try {
    if (sessionId) {
      const existingSession = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });
      if (existingSession) return { success: true, session: existingSession };
    }

    const newSession = await prisma.chatSession.create({
      data: {
        botId,
      },
      include: {
        messages: true,
      },
    });

    return { success: true, session: newSession };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Save a new message to database
export async function saveChatMessageAction(sessionId: string, role: "user" | "assistant", content: string) {
  try {
    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        role,
        content,
      },
    });
    return { success: true, message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
