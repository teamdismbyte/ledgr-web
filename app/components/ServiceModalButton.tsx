"use client";

import { useState, useEffect } from "react";
import { ChevronRight, X } from "lucide-react";

export default function ServiceModalButton({ children, className }: { children: React.ReactNode, className?: string }) {
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsServiceModalOpen(true)}
                className={className}
            >
                {children}
            </button>

            {isServiceModalOpen && (
                <ModalPortal onClose={() => setIsServiceModalOpen(false)} />
            )}
        </>
    );
}

function ModalPortal({ onClose }: { onClose: () => void }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    // Portal to document.body to avoid stacking context issues
    return (
        <>
            {/* 
              We use a portal here because the parent container (sidebar banner) 
              has 'transform' properties which create a new stacking context,
              breaking 'fixed' position relative to the viewport.
            */}
            {typeof document !== "undefined" &&
                (require("react-dom").createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 font-sans">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                            onClick={onClose}
                        />

                        {/* Modal Content */}
                        <div className="relative bg-[#1a1a1a] border border-black rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100 z-[10000]">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="text-center space-y-6">
                                <h2 className="text-xl font-bold text-white">
                                    Elevating Our Services
                                </h2>

                                <div className="space-y-2 text-gray-300 text-sm leading-relaxed keep-all">
                                    <p>We are currently revamping this program to deliver a world-class experience.</p>
                                    <p>In the meantime, we warmly welcome early inquiries and business partnerships.</p>
                                </div>

                                <a
                                    href="mailto:teamdism2024@gmail.com?subject=[Micro Hunter] 비즈니스 제휴 문의"
                                    className="block w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Get in Touch
                                </a>
                            </div>
                        </div>
                    </div>,
                    document.body
                ))}
        </>
    );
}
