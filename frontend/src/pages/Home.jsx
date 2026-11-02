import { Link } from "react-router-dom";

const SIGNALS = [
    ["resume", "Resume", "Skills, projects and experience pulled from the PDF."],
    ["interview", "Interview", "Ten questions written from the resume, scored against model answers."],
    ["voice", "Voice", "Transcript, pace and filler words from a recorded answer."],
    ["vision", "Vision", "Face presence and how centered the candidate sits in frame."],
];

function Home() {
    return (
        <>
            <section className="band slab">
                <div className="band-in hero">
                    <div>
                        <h1>Four signals in. One score you can explain.</h1>
                        <p className="lede">
                            DeepHire reads a candidate's resume, answers, voice and camera frame, then shows how each one moved the final score.
                        </p>
                        <div className="btn-row">
                            <Link className="btn" to="/interview">Start an assessment</Link>
                            <Link className="btn btn-ghost" to="/history">View history</Link>
                        </div>
                    </div>

                    <svg className="trace" viewBox="0 0 520 340" role="img" aria-label="Resume, interview, voice and vision signals merging into one overall score line">
                        <path pathLength="1" style={{ stroke: "var(--resume)" }} d="M10 60 C 90 20, 140 110, 220 90 S 300 150, 340 170" />
                        <path pathLength="1" style={{ stroke: "var(--interview)" }} d="M10 130 C 80 170, 150 60, 230 120 S 300 190, 340 170" />
                        <path pathLength="1" style={{ stroke: "var(--voice)" }} d="M10 220 C 90 180, 140 290, 220 240 S 300 190, 340 170" />
                        <path pathLength="1" style={{ stroke: "var(--vision)" }} d="M10 290 C 90 330, 150 230, 230 270 S 300 200, 340 170" />
                        <path pathLength="1" className="fused" d="M340 170 C 390 170, 420 100, 450 170 S 490 240, 512 170" />
                    </svg>
                </div>
            </section>

            <main className="page">
                <section className="signal-list" aria-label="The four signals">
                    {SIGNALS.map(([key, title, text]) => (
                        <div key={key} style={{ "--sig": `var(--${key})` }}>
                            <h3>{title}</h3>
                            <p>{text}</p>
                        </div>
                    ))}
                </section>
            </main>
        </>
    );
}

export default Home;
