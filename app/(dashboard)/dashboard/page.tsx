"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import {
  Plus,
  Bot,
  Trash2,
  MessageSquare,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { getUserBotsAction, deleteBotAction } from "@/actions/bot.actions";

export default function DashboardPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      getUserBotsAction(session.user.id).then((res) => {
        if (res.success && res.bots) {
          setBots(res.bots);
        }
        setLoading(false);
      });
    }
  }, [session]);

  const handleDelete = async (botId: string) => {
    if (!confirm("Are you sure you want to delete this chatbot?")) return;
    if (!session?.user?.id) return;

    const res = await deleteBotAction(botId, session.user.id);
    if (res.success) {
      setBots(bots.filter((b) => b.id !== botId));
    } else {
      alert(res.error || "Failed to delete bot");
    }
  };

  if (sessionPending || loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-slate-950 text-slate-400">
        <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading Dashboard...
      </div>
    );
  }

  return (
    <div className=" min-h-full">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Your Chatbots
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Create, configure, and manage your custom AI assistants.
            </p>
          </div>
          <Link
            href="/dashboard/create"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition"
          >
            <Plus size={18} /> Create Chatbot
          </Link>
        </div>

        {/* Bots Grid */}
        {bots.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/40 p-16 text-center backdrop-blur-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 mb-4">
              <Bot size={28} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              No chatbots created yet
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mb-6">
              Get started by creating your first AI chatbot trained on custom
              system instructions.
            </p>
            <Link
              href="/dashboard/create"
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition"
            >
              Create Your First Bot
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot) => (
              <div
                key={bot.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      <Bot size={20} />
                    </div>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {bot.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {bot.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/chat/${bot.id}`}
                      target="_blank"
                      className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
                    >
                      <ExternalLink size={14} /> Test Chat
                    </Link>
                  </div>
                  <button
                    onClick={() => handleDelete(bot.id)}
                    className="flex items-center justify-center h-8 w-8 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                    title="Delete Bot"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
