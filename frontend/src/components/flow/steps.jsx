import { useState, useRef, useEffect } from "react";
import { uploadResume } from "../../services/resumeService";
import { analyzeAudio } from "../../services/audioService";
import { analyzeVision } from "../../services/visionService";
import { runAssessment } from "../../services/sessionService";
import ResumeCard from "../ResumeCard";
import VoiceDashboard from "../VoiceDashboard";
import VisionDashboard from "../VisionDashboard";
import FusionDashboard from "../FusionDashboard";
import { Spinner } from "../ui";

function StepHead({ signal, title, text }) {
    return (
        <header className="step-head" style={{ "--sig": signal ? `var(--${signal})` : "var(--ink)" }}>
            <h2>{title}</h2>
            <p>{text}</p>
        </header>
    );
}

const Err = ({ children }) => (children ? <p className="msg msg-err" role="alert">{children}</p> : null);

/* ---------------- Resume ---------------- */
export function ResumeStep({ sessionId, profile, onProfile }) {
    const [file, setFile] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [drag, setDrag] = useState(false);
    const inputRef = useRef(null);

    const pick = (f) => {
        if (!f) return;
        if (!/\.pdf$/i.test(f.name)) {
            setError("Choose a PDF file.");
            return;
        }
        setError("");
        setFile(f);
    };

    const upload = async () => {
        if (!file) {
            setError("Choose a resume PDF first.");
            return;
        }
        setBusy(true);
        setError("");
        try {
            const result = await uploadResume(file, sessionId);
            onProfile(result.profile);
        } catch (err) {
            console.error(err);
            setError("Resume upload failed. Check that the backend is running and try again.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <StepHead signal="resume" title="Upload your resume" text="Your skills, projects and experience shape the interview questions." />
            <div
                className={`dropzone${drag ? " drag" : ""}${file ? " has-file" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        inputRef.current?.click();
                    }
                }}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
            >
                <input ref={inputRef} type="file" accept=".pdf" hidden onChange={(e) => pick(e.target.files[0])} />
                <strong>{file ? file.name : "Drop your resume here"}</strong>
                <span>{file ? `${Math.max(1, Math.round(file.size / 1024))} KB. Click to replace.` : "PDF only. Click to browse."}</span>
            </div>

            <div className="btn-row" style={{ marginTop: 16 }}>
                <button className="btn" onClick={upload} disabled={busy || !file}>
                    {busy ? <><Spinner /> Analyzing resume</> : profile ? "Analyze again" : "Analyze resume"}
                </button>
            </div>
            <Err>{error}</Err>
            {profile && <div style={{ marginTop: 20 }}><ResumeCard profile={profile} /></div>}
        </>
    );
}

/* ---------------- Voice ---------------- */
const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export function VoiceStep({ sessionId, analytics, onAnalytics }) {
    const [recording, setRecording] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [level, setLevel] = useState(0);
    const [elapsed, setElapsed] = useState(0);

    const recRef = useRef(null);
    const chunks = useRef([]);
    const streamRef = useRef(null);
    const ctxRef = useRef(null);
    const rafRef = useRef(0);
    const timerRef = useRef(0);

    const cleanup = () => {
        cancelAnimationFrame(rafRef.current);
        clearInterval(timerRef.current);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        ctxRef.current?.close?.().catch(() => {});
        ctxRef.current = null;
        setLevel(0);
    };

    useEffect(() => () => {
        if (recRef.current && recRef.current.state === "recording") {
            recRef.current.onstop = null;
            recRef.current.stop();
        }
        cleanup();
    }, []);

    const start = async () => {
        setError("");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const rec = new MediaRecorder(stream);
            chunks.current = [];
            rec.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
            rec.onstop = async () => {
                const blob = new Blob(chunks.current, { type: "audio/webm" });
                cleanup();
                setBusy(true);
                try {
                    const result = await analyzeAudio(new File([blob], "answer.webm"), sessionId);
                    onAnalytics(result);
                } catch (err) {
                    console.error(err);
                    setError("Audio analysis failed. Try recording again.");
                } finally {
                    setBusy(false);
                }
            };

            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (Ctx) {
                const ctx = new Ctx();
                ctxRef.current = ctx;
                const analyser = ctx.createAnalyser();
                analyser.fftSize = 256;
                ctx.createMediaStreamSource(stream).connect(analyser);
                const buf = new Uint8Array(analyser.frequencyBinCount);
                const tick = () => {
                    analyser.getByteTimeDomainData(buf);
                    let peak = 0;
                    for (const v of buf) peak = Math.max(peak, Math.abs(v - 128));
                    setLevel(Math.min(1, peak / 90));
                    rafRef.current = requestAnimationFrame(tick);
                };
                tick();
            }

            rec.start();
            recRef.current = rec;
            setElapsed(0);
            timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
            setRecording(true);
        } catch (err) {
            console.error(err);
            cleanup();
            setError("Microphone access was blocked. Allow it in your browser's site settings and try again.");
        }
    };

    const stop = () => {
        if (recRef.current && recording) {
            recRef.current.stop();
            setRecording(false);
        }
    };

    return (
        <>
            <StepHead signal="voice" title="Record a spoken answer" text="Speak for 30 to 90 seconds. Describe a project from your resume and one thing you would do differently." />
            <section className="panel">
                <div className="rec">
                    {!recording ? (
                        <button className="btn btn-rec" onClick={start} disabled={busy}>
                            {analytics ? "Record again" : "Start recording"}
                        </button>
                    ) : (
                        <button className="btn" onClick={stop}>Stop and analyze</button>
                    )}
                    <span className="rec-time">{clock(elapsed)}</span>
                    {recording && <span aria-live="polite"><i className="live-dot" />Recording</span>}
                    <div className="level" aria-hidden="true"><i style={{ transform: `scaleX(${level})` }} /></div>
                </div>
                {busy && <p className="msg msg-note"><Spinner /> Transcribing and scoring your answer. This can take a few seconds.</p>}
                <Err>{error}</Err>
            </section>
            {analytics && <div style={{ marginTop: 16 }}><VoiceDashboard analytics={analytics} /></div>}
        </>
    );
}

/* ---------------- Vision ---------------- */
export function VisionStep({ sessionId, result, onResult }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [on, setOn] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
    }, []);

    const start = async () => {
        setError("");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
            setOn(true);
        } catch (err) {
            console.error(err);
            setError("Camera access was blocked. Allow it in your browser's site settings and try again.");
        }
    };

    const capture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !video.videoWidth) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            if (!blob) return;
            setBusy(true);
            setError("");
            try {
                onResult(await analyzeVision(new File([blob], "frame.png"), sessionId));
            } catch (err) {
                console.error(err);
                setError("Vision analysis failed. Try capturing again.");
            } finally {
                setBusy(false);
            }
        }, "image/png");
    };

    return (
        <>
            <StepHead signal="vision" title="Capture a camera frame" text="Sit facing the camera with your face inside the guide. Attention is scored by how centered you are." />
            <section className="panel">
                <div className="camera">
                    <video ref={videoRef} autoPlay playsInline muted style={{ display: on ? "block" : "none" }} />
                    {on ? <div className="guide" aria-hidden="true" /> : <span>Camera is off</span>}
                </div>
                <canvas ref={canvasRef} hidden />
                <div className="btn-row" style={{ marginTop: 16 }}>
                    {!on ? (
                        <button className="btn" onClick={start}>Turn on camera</button>
                    ) : (
                        <button className="btn" onClick={capture} disabled={busy}>
                            {busy ? <><Spinner /> Analyzing</> : result ? "Capture again" : "Capture frame"}
                        </button>
                    )}
                </div>
                <Err>{error}</Err>
            </section>
            {result && <div style={{ marginTop: 16 }}><VisionDashboard result={result} /></div>}
        </>
    );
}

/* ---------------- Interview ---------------- */
export function InterviewStep({ q }) {
    const { questions, techCount, loading, error, index, answered, allAnswered, answer, setAnswer, submitting, submitError, onSubmit, onLoad } = q;
    const total = questions.length;
    const words = answer.trim() ? answer.trim().split(/\s+/).length : 0;

    return (
        <>
            <StepHead signal="interview" title="Answer your interview questions" text="Questions are written from your resume. Type each answer as you would say it in the room." />

            {loading && (
                <section className="panel">
                    <div className="skeleton" style={{ width: "40%" }} />
                    <div className="skeleton" style={{ width: "90%", height: 26 }} />
                    <div className="skeleton" style={{ width: "70%", height: 26 }} />
                    <p className="subtle">Writing questions from your resume.</p>
                </section>
            )}

            {!loading && error && (
                <section className="panel">
                    <Err>{error}</Err>
                    <button className="btn" style={{ marginTop: 14 }} onClick={onLoad}>Try again</button>
                </section>
            )}

            {!loading && !error && total === 0 && (
                <section className="panel empty">
                    <h3>No questions yet</h3>
                    <p>Upload your resume first, then load your questions.</p>
                    <button className="btn" onClick={onLoad}>Load questions</button>
                </section>
            )}

            {total > 0 && (
                <section className="panel">
                    <div className="segs" aria-hidden="true">
                        {questions.map((_, i) => <i key={i} className={i < answered ? "done" : i === index && !allAnswered ? "now" : ""} />)}
                    </div>

                    {allAnswered ? (
                        <>
                            <h3>All {total} answers submitted</h3>
                            <p className="msg msg-ok">Continue to generate your final assessment.</p>
                        </>
                    ) : (
                        <>
                            <div className="q-meta">
                                <span>Question {index + 1} of {total}</span>
                                <span className="chip" style={{ "--sig": "var(--interview)" }}>{index < techCount ? "Technical" : "Behavioral"}</span>
                            </div>
                            <p className="q-text">{questions[index].question}</p>
                            <textarea
                                className="textarea"
                                value={answer}
                                placeholder="Type your answer"
                                aria-label="Your answer"
                                onChange={(e) => setAnswer(e.target.value)}
                                onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") onSubmit(); }}
                            />
                            <div className="q-foot">
                                <span>{words} {words === 1 ? "word" : "words"}. Ctrl+Enter to submit.</span>
                                <button className="btn" onClick={onSubmit} disabled={submitting}>
                                    {submitting ? <><Spinner /> Submitting</> : index === total - 1 ? "Submit final answer" : "Submit and continue"}
                                </button>
                            </div>
                            <Err>{submitError}</Err>
                        </>
                    )}
                </section>
            )}
        </>
    );
}

/* ---------------- Result ---------------- */
export function ResultStep({ sessionId, result, onResult, answered, total }) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const run = async () => {
        setBusy(true);
        setError("");
        try {
            onResult(await runAssessment(sessionId));
        } catch (err) {
            console.error(err);
            setError("Could not generate the final assessment. Check that the backend is running and try again.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <StepHead title="Final assessment" text="Resume, interview, voice and vision scores are combined into one result you can inspect." />
            {!result && (
                <section className="panel">
                    {total > 0 && answered < total && (
                        <p className="msg msg-note" style={{ marginTop: 0, marginBottom: 16 }}>
                            You have answered {answered} of {total} questions. You can still generate the assessment now.
                        </p>
                    )}
                    <button className="btn" onClick={run} disabled={busy}>
                        {busy ? <><Spinner /> Combining four signals</> : "Generate final assessment"}
                    </button>
                    <Err>{error}</Err>
                </section>
            )}
            {result && <FusionDashboard result={result} />}
        </>
    );
}
