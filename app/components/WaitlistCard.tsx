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
    <div className="w-full bg-[#121212] border border-gray-800/50 rounded-3xl p-6 flex flex-col gap-4 transition-all duration-300 hover:border-gray-600 hover:shadow-xl hover:shadow-black/50">
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Get the Signal</h3>
        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
          Join the exclusive waitlist for our private founders community & top 1% insights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
