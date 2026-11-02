import { useState, useEffect } from "react";
import { createSession, getInterviewQuestions, submitAnswer } from "../services/sessionService";
import { ResumeStep, VoiceStep, VisionStep, InterviewStep, ResultStep } from "../components/flow/steps";
import { Spinner } from "../components/ui";
import { fmt } from "../lib/signals";

const STEPS = [
    { key: "resume", name: "Resume" },
    { key: "voice", name: "Voice" },
    { key: "vision", name: "Vision" },
    { key: "interview", name: "Interview" },
    { key: "result", name: "Result" },
];

const EXPECT = [
    ["resume", "Resume", "Upload a PDF. We extract your skills, projects and experience."],
    ["voice", "Voice", "Record a spoken answer. We score clarity, pace and filler words."],
    ["vision", "Vision", "Capture one camera frame. We score face presence and attention."],
    ["interview", "Interview", "Answer eight technical and two behavioral questions written from your resume."],
    ["ink", "Result", "See one overall score and exactly which signals moved it."],
];

function InterviewFlow() {
    const [session, setSession] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [starting, setStarting] = useState(false);
    const [startError, setStartError] = useState("");
    const [step, setStep] = useState(0);

    const [profile, setProfile] = useState(null);
    const [audio, setAudio] = useState(null);
    const [vision, setVision] = useState(null);
    const [finalResult, setFinalResult] = useState(null);

    const [questions, setQuestions] = useState([]);
    const [techCount, setTechCount] = useState(0);
    const [qLoading, setQLoading] = useState(false);
    const [qError, setQError] = useState("");
    const [index, setIndex] = useState(0);
    const [answered, setAnswered] = useState(0);
    const [allAnswered, setAllAnswered] = useState(false);
    const [answer, setAnswer] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => { window.scrollTo({ top: 0 }); }, [step]);

    const start = async (e) => {
        e?.preventDefault();
        if (!name.trim()) {
            setStartError("Enter your name to begin.");
            return;
        }
        setStarting(true);
        setStartError("");
        try {
            setSession(await createSession(name, email));
        } catch (err) {
            console.error(err);
            setStartError("Could not create a session. Check that the backend is running on port 8000.");
        } finally {
            setStarting(false);
        }
    };

    const loadQuestions = async () => {
        setQLoading(true);
        setQError("");
        try {
            const data = await getInterviewQuestions(session.id);
            if (data.error) {
                setQError(data.error);
            } else {
                setQuestions([...data.technical, ...data.behavioral]);
                setTechCount(data.technical.length);
            }
        } catch (err) {
            console.error(err);
            setQError("Could not load interview questions. Upload your resume first, then try again.");
        } finally {
            setQLoading(false);
        }
    };

    const submit = async () => {
        if (!answer.trim()) {
            setSubmitError("Type an answer before submitting.");
            return;
        }
        setSubmitting(true);
        setSubmitError("");
        try {
            const q = questions[index];
            await submitAnswer(session.id, q.question, q.answer, answer);
            const next = index + 1;
            setAnswered(next);
            setAnswer("");
            if (next >= questions.length) setAllAnswered(true);
            else setIndex(next);
        } catch (err) {
            console.error(err);
            setSubmitError("Could not submit this answer. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const goTo = (i) => {
        if (i === 3 && questions.length === 0 && !qLoading) loadQuestions();
        setStep(i);
    };

    if (!session) {
        return (
            <main className="page">
                <div className="start">
                    <form onSubmit={start} noValidate>
                        <div className="page-head">
                            <h2>Start your assessment</h2>
                            <p>It takes about fifteen minutes. Your session keeps your progress if you move between steps.</p>
                        </div>
                        <label className="field">
                            <span>Full name</span>
                            <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" autoFocus />
                        </label>
                        <label className="field">
                            <span>Email <small>(optional)</small></span>
                            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                        </label>
                        <button className="btn" type="submit" disabled={starting}>
                            {starting ? <><Spinner /> Creating session</> : "Begin assessment"}
                        </button>
                        {startError && <p className="msg msg-err" role="alert">{startError}</p>}
                    </form>

                    <ol className="expect">
                        {EXPECT.map(([k, title, text]) => (
                            <li key={title} style={{ "--sig": `var(--${k})` }}>
                                <i />
                                <div><b>{title}</b><span>{text}</span></div>
                            </li>
                        ))}
                    </ol>
                </div>
            </main>
        );
    }

    const meta = [
        profile ? `${profile.skills?.length || 0} skills found` : "Not started",
        audio ? `Score ${fmt(audio.voice_score)}` : "Not started",
        vision ? `Attention ${fmt(vision.attention_score)}` : "Not started",
        questions.length ? `${answered} of ${questions.length} answered` : "Not started",
        finalResult ? `Overall ${fmt(finalResult.overall_score)}` : "Not started",
    ];
    const done = [Boolean(profile), Boolean(audio), Boolean(vision), allAnswered, Boolean(finalResult)];

    return (
        <main className="page">
            <div className="flow">
                <nav className="rail slab" aria-label="Assessment steps">
                    <div className="rail-who">
                        <b>{session.candidate_name || name}</b>
                        <span>Session #{session.id}</span>
                    </div>
                    <ol>
                        {STEPS.map((s, i) => (
                            <li key={s.key}>
                                <button
                                    onClick={() => goTo(i)}
                                    className={i === step ? "active" : done[i] ? "done" : ""}
                                    style={{ "--sig": s.key === "result" ? "var(--ink)" : `var(--${s.key})` }}
                                    aria-current={i === step ? "step" : undefined}
                                >
                                    <span className="rail-dot">{done[i] && i !== step ? "✓" : i + 1}</span>
                                    <span className="rail-name">{s.name}<span className="rail-meta">{meta[i]}</span></span>
                                </button>
                            </li>
                        ))}
                    </ol>
                </nav>

                <section>
                    {step === 0 && <ResumeStep sessionId={session.id} profile={profile} onProfile={setProfile} />}
                    {step === 1 && <VoiceStep sessionId={session.id} analytics={audio} onAnalytics={setAudio} />}
                    {step === 2 && <VisionStep sessionId={session.id} result={vision} onResult={setVision} />}
                    {step === 3 && (
                        <InterviewStep
                            q={{ questions, techCount, loading: qLoading, error: qError, index, answered, allAnswered, answer, setAnswer, submitting, submitError, onSubmit: submit, onLoad: loadQuestions }}
                        />
                    )}
                    {step === 4 && <ResultStep sessionId={session.id} result={finalResult} onResult={setFinalResult} answered={answered} total={questions.length} />}

                    <div className="flow-nav">
                        <button className="btn btn-ghost" onClick={() => goTo(step - 1)} disabled={step === 0}>Back</button>
                        {step < STEPS.length - 1 && (
                            <button className="btn" onClick={() => goTo(step + 1)}>
                                Continue to {STEPS[step + 1].name.toLowerCase()}
                            </button>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default InterviewFlow;
