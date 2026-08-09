import { useState }
    from "react";

import {
    assessCandidate
}
from "../services/fusionService";

import FusionDashboard
    from "./FusionDashboard";

function FusionTester() {

    const [result,
        setResult] =
            useState(null);

    const analyze =
        async () => {

            const response =
                await assessCandidate({

                    resume_score: 80,

                    interview_score: 75,

                    voice_score: 85,

                    vision_score: 90
                });

            setResult(
                response
            );
        };

    return (
        <div
            style={{
                padding: "20px"
            }}
        >
            <h1>
                Fusion Dashboard
            </h1>

            <button
                onClick={
                    analyze
                }
            >
                Generate Assessment
            </button>

            <FusionDashboard
                result={result}
            />
        </div>
    );
}

export default FusionTester;