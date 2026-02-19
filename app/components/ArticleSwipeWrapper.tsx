"use client";

import { useRouter } from "next/navigation";
import { useRef, ReactNode } from "react";

interface ArticleSwipeWrapperProps {
    children: ReactNode;
    className?: string;
}

export default function ArticleSwipeWrapper({ children, className }: ArticleSwipeWrapperProps) {
    const router = useRouter();
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const MIN_SWIPE_DISTANCE = 80;
    const MAX_VERTICAL_VARIANCE = 50;
    const LEFT_EDGE_THRESHOLD = 50; // Only trigger if started from the left 50px

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartX.current;
        const deltaY = Math.abs(touchEndY - touchStartY.current);

        // 1. Check if swipe started from the left edge
        if (touchStartX.current <= LEFT_EDGE_THRESHOLD) {
            // 2. Check if swipe distance is significant enough
            if (deltaX > MIN_SWIPE_DISTANCE) {
                // 3. Check if vertical movement is minimal (horizontal swipe)
                if (deltaY < MAX_VERTICAL_VARIANCE) {
                    router.push("/");
                }
            }
        }

        // Reset
        touchStartX.current = null;
        touchStartY.current = null;
    };

    return (
        <div
            className={className}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {children}
        </div>
    );
}
