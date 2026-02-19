"use client";

import { Share2, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

interface ArticleHeaderActionsProps {
    title: string;
}

export default function ArticleHeaderActions({ title }: ArticleHeaderActionsProps) {
    const [showToast, setShowToast] = useState(false);

    const handleShare = async () => {
        if (typeof navigator !== "undefined") {
            const url = window.location.href;
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: title,
                        url: url,
                    });
                } catch (error) {
                    console.error("Error sharing:", error);
                }
            } else {
                // Fallback to copy link
                handleCopyLink();
            }
        }
    };

    const handleCopyLink = async () => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            } catch (error) {
                console.error("Error copying link:", error);
            }
        }
    };

    return (
        <div className="flex items-center gap-4 relative">
            <button
                onClick={handleShare}
                className="text-gray-400 hover:text-white transition-colors"
                title="Share"
            >
                <Share2 className="w-5 h-5" />
            </button>
            <button
                onClick={handleCopyLink}
                className="text-gray-400 hover:text-white transition-colors"
                title="Copy Link"
            >
                <LinkIcon className="w-5 h-5" />
            </button>

            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-10 right-0 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2 whitespace-nowrap z-50">
                    Link copied!
                </div>
            )}
        </div>
    );
}
