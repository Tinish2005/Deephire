import { useState } from "react";

import {
    analyzeVision
} from "../services/visionService";

import VisionDashboard
    from "./VisionDashboard";

function VisionTester() {

    const [result,
        setResult] =
            useState(null);

    const uploadImage =
        async (event) => {

            const file =
                event.target.files[0];

            if (!file) return;

            try {

                const response =
                    await analyzeVision(
                        file
                    );

                setResult(
                    response
                );

            } catch (error) {

                console.error(
                    error
                );
            }
        };

    return (
        <div
            style={{
                padding: "20px"
            }}
        >
            <h1>
                Vision Analysis
            </h1>

            <input
                type="file"
                accept="image/*"
                onChange={
                    uploadImage
                }
            />

            <VisionDashboard
                result={result}
            />
        </div>
    );
}

export default VisionTester;