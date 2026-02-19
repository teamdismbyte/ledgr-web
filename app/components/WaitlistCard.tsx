"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function WaitlistCard() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Temporary logic: Frontend-only alert
    alert("Thank you! You've been added to the waitlist.");
    setEmail("");
  };

  return (
    <div className="relative w-full bg-[#121212] border border-gray-800/50 rounded-3xl p-5 flex flex-col gap-4 overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-white mb-2">Join the Builders' Network</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          A private space for founders and future builders to share raw insights and network. Invites roll out soon.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-white/5 border border-gray-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
        />

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold text-sm px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Join Waitlist <ChevronRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
