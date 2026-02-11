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
                                    서비스 고도화 작업 중
                                </h2>

                                <div className="space-y-2 text-gray-300 text-sm leading-relaxed keep-all">
                                    <p>현재 더 높은 퀄리티의 서비스를 제공하기 위해<br />리뉴얼 작업을 진행하고 있습니다.</p>
                                    <p>관련된 <span className="text-white font-bold">비즈니스 제휴나 사전 문의</span>는<br />언제든 환영합니다.</p>
                                </div>

                                <a
                                    href="mailto:teamdism2024@gmail.com?subject=[Micro Hunter] 비즈니스 제휴 문의"
                                    className="block w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    문의하기
                                </a>
                            </div>
                        </div>
                    </div>,
                    document.body
                ))}
        </>
    );
}
