function ResumeCard({ profile }) {
    return (
        <div
            style={{
                padding: "20px",
                border: "1px solid #ccc",
                marginTop: "20px",
                borderRadius: "10px",
            }}
        >
            <h2>Resume Analysis</h2>

            <h3>Skills</h3>

            <ul>
                {profile.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                ))}
            </ul>

            <h3>Projects</h3>

            <ul>
                {profile.projects.map((project, index) => (
                    <li key={index}>{project}</li>
                ))}
            </ul>

            <h3>Experience</h3>

            <ul>
                {profile.experience.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default ResumeCard;