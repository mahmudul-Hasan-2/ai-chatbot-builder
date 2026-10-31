"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { createBotAction } from "@/actions/bot.actions";
import { ArrowLeft, Bot, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CreateBotPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant.",
  );
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Hello! How can I help you today?",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      setError("You must be logged in to create a bot");
      return;
    }

    setLoading(true);
    setError("");

    const res = await createBotAction({
      userId: session.user.id,
      name,
      description,
      systemPrompt,
      model: "openai/gpt-oss-120b", // এখানে আপডেট করুন
      temperature: 0.7,
      welcomeMessage,
      isPublic: true,
    });

    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Failed to create chatbot");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Create New Chatbot
              </h1>
              <p className="text-xs text-slate-400">
                Configure your bot's persona and instructions.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Bot Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Customer Support Expert"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what this bot does..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                System Instructions / Persona
              </label>
              <textarea
                rows={4}
                required
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="You are a helpful assistant for our company..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Welcome Message
              </label>
              <input
                type="text"
                required
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Hello! How can I help you today?"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 shadow-lg shadow-blue-600/30 transition"
            >
              {loading ? "Creating..." : "Create Chatbot"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
