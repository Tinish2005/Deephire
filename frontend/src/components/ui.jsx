import { useEffect, useState } from "react";
import { num } from "../lib/signals";

export function Spinner() {
    return <span className="spinner" aria-hidden="true" />;
}

export function ScoreRing({ value, size = 120, stroke = 10, color = "var(--ink)", label = "Score" }) {
    const n = num(value);
    const pct = n === null ? 0 : Math.max(0, Math.min(100, n));
    const [shown, setShown] = useState(0);

    useEffect(() => {
        const id = requestAnimationFrame(() => setShown(pct));
        return () => cancelAnimationFrame(id);
    }, [pct]);

    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;

    return (
        <div
            className="ring"
            style={{ width: size, height: size }}
            role="img"
            aria-label={`${label}: ${n === null ? "not available" : Math.round(n)} out of 100`}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={c}
                    strokeDashoffset={c * (1 - shown / 100)}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    className="ring-arc"
                />
            </svg>
            <span className="ring-num" style={{ fontSize: size * 0.3 }}>
                {n === null ? "—" : Math.round(n)}
            </span>
        </div>
    );
}

export function Meter({ label, value, color = "var(--ink)", max = 100 }) {
    const n = num(value);
    const pct = n === null ? 0 : Math.max(0, Math.min(100, (n / max) * 100));
    return (
        <div className="meter">
            <div className="meter-row">
                <span>{label}</span>
                <b>{n === null ? "—" : Math.round(n)}</b>
            </div>
            <div className="meter-track">
                <i style={{ width: `${pct}%`, background: color }} />
            </div>
        </div>
    );
}
