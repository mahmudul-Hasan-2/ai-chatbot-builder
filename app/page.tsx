import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Bot, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-black">
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center max-w-4xl mx-auto my-auto ">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400 mb-6 shadow-sm">
          <Sparkles size={14} /> Powered by Groq & Llama 3.3
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Create Custom AI Chatbots <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            In Seconds, Without Code
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
          Build intelligent chatbots trained on your custom instructions and
          data. Get a unique shareable public link and embed them anywhere.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition"
          >
            Build Your First Bot <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 px-8 py-3.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
              <Zap size={20} />
            </div>
            <h3 className="font-semibold text-white mb-1">Lightning Fast</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by Groq inference for real-time streaming responses with
              zero lag.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
              <Bot size={20} />
            </div>
            <h3 className="font-semibold text-white mb-1">Custom Prompts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define exact personas, system instructions, and welcome messages
              for your bots.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-semibold text-white mb-1">Shareable Links</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate public chat links so anyone can talk to your bot
              instantly without login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
