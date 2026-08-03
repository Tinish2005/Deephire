import { useState } from "react";

import ResumeCard from "../components/ResumeCard";

import { uploadResume } from "../services/resumeService";

function ResumeUpload() {
    const [file, setFile] = useState(null);

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) {
            alert("Select a PDF resume first");
            return;
        }

        try {
            setLoading(true);

            const response = await uploadResume(file);

            setProfile(response.profile);
        } catch (error) {
            console.error(error);

            alert("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1>Resume Intelligence</h1>

            <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <br />
            <br />

            <button onClick={handleUpload}>
                Upload Resume
            </button>

            {loading && <p>Analyzing Resume...</p>}

            {profile && (
                <ResumeCard profile={profile} />
            )}
        </div>
    );
}

export default ResumeUpload;