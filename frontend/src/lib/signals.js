export const API_URL = "http://127.0.0.1:8000";

// Each scoring channel keeps one colour everywhere in the UI.
export const SIGNALS = {
    resume: { label: "Resume", color: "var(--resume)", hex: "#3446D6" },
    interview: { label: "Interview", color: "var(--interview)", hex: "#B96A00" },
    voice: { label: "Voice", color: "var(--voice)", hex: "#D13A21" },
    vision: { label: "Vision", color: "var(--vision)", hex: "#0A8782" },
};

export const isStrong = (rec) => rec === "Strong Candidate";

export const num = (v) => {
    const n = Number(v);
    return v === null || v === undefined || v === "" || Number.isNaN(n) ? null : n;
};

export const fmt = (v, digits = 0) => {
    const n = num(v);
    return n === null ? "—" : n.toFixed(digits);
};

export const shortDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" })
        : "";
