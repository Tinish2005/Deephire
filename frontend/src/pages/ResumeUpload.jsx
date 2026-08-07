import { useState } from "react";

import ResumeCard from "../components/ResumeCard";
import Interview from "./Interview";

import { uploadResume }
    from "../services/resumeService";

function ResumeUpload() {

    const [file, setFile] = useState(null);

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [startInterview, setStartInterview] =
        useState(false);

    const handleUpload = async () => {

        if (!file) {
            alert("Select a PDF first");
            return;
        }

        try {

            setLoading(true);

            const response =
                await uploadResume(file);

            setProfile(
                response.profile
            );

        } catch (error) {

            console.error(error);

            alert("Upload failed");

        } finally {

            setLoading(false);

        }
    };

    if (startInterview) {

        return (
            <Interview
                profile={profile}
            />
        );
    }

    return (
        <div
            style={{
                padding: "40px"
            }}
        >
            <h1>
                DeepHire Resume Intelligence
            </h1>

            <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                    setFile(
                        e.target.files[0]
                    )
                }
            />

            <br />
            <br />

            <button
                onClick={handleUpload}
            >
                Upload Resume
            </button>

            {loading &&
                <p>
                    Analyzing Resume...
                </p>
            }

            {profile && (
                <>
                    <ResumeCard
                        profile={profile}
                    />

                    <button
                        style={{
                            marginTop: "20px",
                            padding: "10px"
                        }}
                        onClick={() =>
                            setStartInterview(
                                true
                            )
                        }
                    >
                        Start Interview
                    </button>
                </>
            )}
        </div>
    );
}

export default ResumeUpload;