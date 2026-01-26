'use client';

import { useState, useEffect } from 'react';

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState<{ h: number, m: number, s: number }>({ h: 0, m: 0, s: 0 });

    useEffect(() => {
        // Generate a consistent "end of day" or similar for testing
        // Or just a cyclic 12h countdown
        const updateTimer = () => {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const diff = endOfDay.getTime() - now.getTime();

            if (diff > 0) {
                const h = Math.floor(diff / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft({ h, m, s });
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <span className="flex items-center space-x-1 ml-2 bg-black/20 px-1.5 py-0.5 rounded text-[9px] font-mono">
            <span>{timeLeft.h.toString().padStart(2, '0')}</span>
            <span>:</span>
            <span>{timeLeft.m.toString().padStart(2, '0')}</span>
            <span>:</span>
            <span className="text-red-300">{timeLeft.s.toString().padStart(2, '0')}</span>
        </span>
    );
}
