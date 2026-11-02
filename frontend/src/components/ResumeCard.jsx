import { ScoreRing } from "./ui";
import { SIGNALS, num } from "../lib/signals";

function ResumeCard({ profile }) {
    const skills = profile.skills || [];
    const projects = profile.projects || [];
    const experience = profile.experience || [];
    const score = num(profile.resume_score ?? profile.score?.resume_score);

    return (
        <section className="panel" style={{ "--sig": SIGNALS.resume.color }}>
            <div className="verdict" style={{ marginBottom: 8 }}>
                <div className="verdict-text">
                    <h3>What we found in your resume</h3>
                    <p className="subtle">
                        {skills.length} skills, {projects.length} projects and {experience.length} experience entries.
                    </p>
                </div>
                {score !== null && <ScoreRing value={score} size={84} stroke={8} color={SIGNALS.resume.color} label="Resume score" />}
            </div>

            <p className="sub">Skills</p>
            <div className="chips">
                {skills.map((s, i) => <span className="chip" key={i}>{s}</span>)}
                {skills.length === 0 && <span className="subtle">No skills detected.</span>}
            </div>

            <p className="sub">Projects</p>
            <ul className="list-plain">
                {projects.map((p, i) => <li key={i}>{p}</li>)}
                {projects.length === 0 && <li>No projects detected.</li>}
            </ul>

            <p className="sub">Experience</p>
            <ul className="list-plain" style={{ marginBottom: 0 }}>
                {experience.map((e, i) => <li key={i}>{e}</li>)}
                {experience.length === 0 && <li>No experience detected.</li>}
            </ul>
        </section>
    );
}

export default ResumeCard;
