"use client";

import Link from "next/link";
import { Bot, LogOut, LayoutDashboard, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80  backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
            <Bot size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            BotBuilder
          </span>
        </Link>

        {/* Dynamic Navigation Links & Auth State */}
        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="h-8 w-24 animate-pulse rounded bg-slate-800" />
          ) : session ? (
            // When User IS Logged In
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition"
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>

              <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                {/* User Avatar / Profile Icon */}
                <div className="flex items-center gap-2">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="h-8 w-8 rounded-full border border-slate-700 object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold text-xs">
                      {session.user.name?.charAt(0).toUpperCase() || (
                        <User size={14} />
                      )}
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                    {session.user.name}
                  </span>
                </div>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition"
                  title="Sign Out"
                >
                  <LogOut size={14} />{" "}
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            // When User IS NOT Logged In
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-slate-300 hover:text-white transition px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition shadow-md shadow-blue-600/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
