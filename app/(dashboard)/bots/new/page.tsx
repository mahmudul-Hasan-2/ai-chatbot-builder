"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { createBotAction } from "@/actions/bot.actions";
import { useRouter } from "next/navigation";

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
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const [temperature, setTemperature] = useState(0.7);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLoading(true);
    setError("");

    const res = await createBotAction({
      userId: session.user.id,
      name,
      description,
      systemPrompt,
      welcomeMessage,
      model,
      temperature: Number(temperature),
      isPublic,
    });

    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Failed to create chatbot");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-2xl font-bold mb-6">
          Create New AI Chatbot (Groq Powered)
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Bot Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Support Assistant"
              className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary of what this bot does"
              className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              System Instructions *
            </label>
            <textarea
              rows={4}
              required
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Welcome Message
            </label>
            <input
              type="text"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Model (Groq)
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="llama-3.3-70b-versatile">
                  Llama 3.3 70B (Recommended)
                </option>
                <option value="llama-3.1-8b-instant">
                  Llama 3.1 8B (Ultra Fast)
                </option>
                <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">
                Temperature ({temperature})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="mt-3 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-slate-800 bg-slate-950"
            />
            <label htmlFor="isPublic" className="text-sm text-slate-300">
              Make this bot public
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-md border border-slate-800 px-4 py-2 text-sm hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Bot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
