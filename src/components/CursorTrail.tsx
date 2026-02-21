import { useEffect, useRef, useState } from "react";

interface Particle {
    id: number;
    x: number;
    y: number;
    emoji: string;
    scale: number;
    rotation: number;
    opacity: number;
}

const TRAIL_EMOJIS = ["🐾", "✨", "🌸", "💛", "🐾", "⭐", "🌸", "🐾"];

export const CursorTrail = () => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [pos, setPos] = useState({ x: -100, y: -100 });
    const [dotPos, setDotPos] = useState({ x: -100, y: -100 });
    const counter = useRef(0);
    const lastSpawn = useRef(0);
    const raf = useRef<number>(0);
    const targetPos = useRef({ x: -100, y: -100 });

    // Smooth dot follows cursor with spring lag
    useEffect(() => {
        let current = { x: -100, y: -100 };

        const animate = () => {
            current.x += (targetPos.current.x - current.x) * 0.14;
            current.y += (targetPos.current.y - current.y) * 0.14;
            setDotPos({ ...current });
            raf.current = requestAnimationFrame(animate);
        };
        raf.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf.current);
    }, []);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const x = e.clientX;
            const y = e.clientY;
            targetPos.current = { x, y };
            setPos({ x, y });

            const now = Date.now();
            if (now - lastSpawn.current < 80) return; // throttle
            lastSpawn.current = now;

            const id = counter.current++;
            const emoji = TRAIL_EMOJIS[id % TRAIL_EMOJIS.length];

            setParticles((prev) => [
                ...prev.slice(-18), // keep max 18
                {
                    id,
                    x: x + (Math.random() - 0.5) * 14,
                    y: y + (Math.random() - 0.5) * 14,
                    emoji,
                    scale: 0.55 + Math.random() * 0.5,
                    rotation: -20 + Math.random() * 40,
                    opacity: 1,
                },
            ]);
        };

        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    // Fade out particles
    useEffect(() => {
        if (particles.length === 0) return;
        const timer = setTimeout(() => {
            setParticles((prev) =>
                prev
                    .map((p) => ({ ...p, opacity: p.opacity - 0.07 }))
                    .filter((p) => p.opacity > 0)
            );
        }, 40);
        return () => clearTimeout(timer);
    }, [particles]);

    return (
        <>
            {/* Glow dot — lags slightly behind cursor */}
            <div
                className="pointer-events-none fixed z-[9999] rounded-full mix-blend-multiply"
                style={{
                    left: dotPos.x,
                    top: dotPos.y,
                    width: 36,
                    height: 36,
                    transform: "translate(-50%, -50%)",
                    background: "radial-gradient(circle, hsl(12 100% 58% / 0.55) 0%, transparent 70%)",
                    transition: "opacity 0.2s",
                    filter: "blur(2px)",
                }}
            />

            {/* Crisp cursor dot */}
            <div
                className="pointer-events-none fixed z-[9999] rounded-full"
                style={{
                    left: pos.x,
                    top: pos.y,
                    width: 8,
                    height: 8,
                    transform: "translate(-50%, -50%)",
                    background: "hsl(12 100% 58%)",
                    boxShadow: "0 0 6px 2px hsl(12 100% 58% / 0.5)",
                    transition: "transform 0.08s",
                }}
            />

            {/* Particle trail */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="pointer-events-none fixed z-[9998] select-none"
                    style={{
                        left: p.x,
                        top: p.y,
                        fontSize: `${p.scale * 16}px`,
                        opacity: p.opacity,
                        transform: `translate(-50%, -50%) rotate(${p.rotation}deg) scale(${p.opacity})`,
                        transition: "opacity 0.04s linear, transform 0.04s linear",
                        lineHeight: 1,
                    }}
                >
                    {p.emoji}
                </div>
            ))}
        </>
    );
};
