"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CreateBotInput {
  userId: string;
  name: string;
  description?: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  welcomeMessage: string;
  isPublic: boolean;
}

export async function createBotAction(data: CreateBotInput) {
  try {
    const bot = await prisma.chatbot.create({
      data: {
        userId: data.userId,
        name: data.name,
        description: data.description,
        systemPrompt: data.systemPrompt,
        model: data.model,
        temperature: data.temperature,
        welcomeMessage: data.welcomeMessage,
        isPublic: data.isPublic,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, bot };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create chatbot",
    };
  }
}

export async function getUserBotsAction(userId: string) {
  try {
    const bots = await prisma.chatbot.findMany({
      where: { userId },
      include: {
        _count: {
          select: { chats: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, bots };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch chatbots",
    };
  }
}

export async function deleteBotAction(botId: string, userId: string) {
  try {
    await prisma.chatbot.deleteMany({
      where: { id: botId, userId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to delete chatbot",
    };
  }
}
