"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function WaitlistCard() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("email", email);

      const response = await fetch("https://formspree.io/f/xvzbqjzo", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");
      } else {
        console.error("Submission failed");
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error connecting to server.");
    } finally {
      setIsSubmitting(false);
    }
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
          name="email"
          placeholder={isSubmitted ? "" : "Enter your email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={!isSubmitted}
          disabled={isSubmitted || isSubmitting}
          className={`w-full bg-white/5 border border-gray-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
        />

        <button
          type="submit"
          disabled={isSubmitted || isSubmitting}
          className={`w-full flex items-center justify-center gap-2 font-bold text-sm px-4 py-3 rounded-xl transition-colors ${isSubmitted ? 'bg-zinc-800 text-zinc-400 cursor-default' : 'bg-white text-black hover:bg-gray-200'} ${(isSubmitting) ? 'opacity-70 cursor-wait' : ''}`}
        >
          {isSubmitted ? (
            "✓ Added to the list"
          ) : isSubmitting ? (
            "Submitting..."
          ) : (
            <>Join Waitlist <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </form>
    </div>
  );
}
