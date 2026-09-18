import { useState, useRef } from "react";
import {
    createSession,
    getInterviewQuestions,
    submitAnswer,
    runAssessment,
} from "../services/sessionService";
import { uploadResume } from "../services/resumeService";
import { analyzeAudio } from "../services/audioService";
import { analyzeVision } from "../services/visionService";
import ResumeCard from "../components/ResumeCard";
import VoiceDashboard from "../components/VoiceDashboard";
import VisionDashboard from "../components/VisionDashboard";
import FusionDashboard from "../components/FusionDashboard";

const STEPS = [
    "Resume",
    "Voice",
    "Vision",
    "Interview",
    "Result",
];

function InterviewFlow() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [candidateName, setCandidateName] = useState("");
    const [email, setEmail] = useState("");
    const [started, setStarted] = useState(false);

    const [resumeFile, setResumeFile] = useState(null);
    const [resumeProfile, setResumeProfile] = useState(null);
    const [resumeUploading, setResumeUploading] = useState(false);
    const [resumeError, setResumeError] = useState("");

    const [recording, setRecording] = useState(false);
    const [audioAnalytics, setAudioAnalytics] = useState(null);
    const [audioUploading, setAudioUploading] = useState(false);
    const [audioError, setAudioError] = useState("");

    const [cameraOn, setCameraOn] = useState(false);
    const [visionResult, setVisionResult] = useState(null);
    const [visionUploading, setVisionUploading] = useState(false);
    const [visionError, setVisionError] = useState("");

    const [questions, setQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [questionsError, setQuestionsError] = useState("");
    const [candidateAnswer, setCandidateAnswer] = useState("");
    const [answerSubmitting, setAnswerSubmitting] = useState(false);
    const [answerSubmitted, setAnswerSubmitted] = useState(false);
    const [answerError, setAnswerError] = useState("");

    const [finalResult, setFinalResult] = useState(null);
    const [finalLoading, setFinalLoading] = useState(false);
    const [finalError, setFinalError] = useState("");

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleStart = async () => {
        if (!candidateName.trim()) {
            setError("Please enter your name to begin.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await createSession(candidateName, email);
            setSession(data);
            setStarted(true);
        } catch (err) {
            console.error(err);
            setError("Failed to create session.");
        } finally {
            setLoading(false);
        }
    };

    const handleResumeUpload = async () => {
        if (!resumeFile) {
            setResumeError("Please choose a resume file first.");
            return;
        }

        setResumeUploading(true);
        setResumeError("");

        try {
            const result = await uploadResume(resumeFile, session.id);
            setResumeProfile(result.profile);
        } catch (err) {
            console.error(err);
            setResumeError("Resume upload failed.");
        } finally {
            setResumeUploading(false);
        }
    };

    const startRecording = async () => {
        setAudioError("");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            const recorder = new MediaRecorder(stream);

            chunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            recorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, {
                    type: "audio/webm",
                });

                setAudioUploading(true);

                try {
                    const audioFile = new File([blob], "answer.webm");
                    const result = await analyzeAudio(audioFile, session.id);
                    setAudioAnalytics(result);
                } catch (err) {
                    console.error(err);
                    setAudioError("Audio analysis failed.");
                } finally {
                    setAudioUploading(false);
                }
            };

            mediaRecorderRef.current = recorder;
            recorder.start();
            setRecording(true);
        } catch (err) {
            console.error(err);
            setAudioError("Microphone access denied.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const startCamera = async () => {
        setVisionError("");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setCameraOn(true);
        } catch (err) {
            console.error(err);
            setVisionError("Camera access denied.");
        }
    };

    const captureFrame = async () => {
        if (!videoRef.current || !canvasRef.current) {
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            setVisionUploading(true);
            setVisionError("");

            try {
                const imageFile = new File([blob], "frame.png");
                const result = await analyzeVision(imageFile, session.id);
                setVisionResult(result);
            } catch (err) {
                console.error(err);
                setVisionError("Vision analysis failed.");
            } finally {
                setVisionUploading(false);
            }
        }, "image/png");
    };

    const loadQuestions = async () => {
        setQuestionsLoading(true);
        setQuestionsError("");

        try {
            const data = await getInterviewQuestions(session.id);

            if (data.error) {
                setQuestionsError(data.error);
            } else {
                setQuestions(data.questions);
            }
        } catch (err) {
            console.error(err);
            setQuestionsError("Failed to load interview questions.");
        } finally {
            setQuestionsLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!candidateAnswer.trim()) {
            setAnswerError("Please type an answer first.");
            return;
        }

        setAnswerSubmitting(true);
        setAnswerError("");

        try {
            await submitAnswer(session.id, questions[0], candidateAnswer);
            setAnswerSubmitted(true);
        } catch (err) {
            console.error(err);
            setAnswerError("Failed to submit answer.");
        } finally {
            setAnswerSubmitting(false);
        }
    };

    const handleRunAssessment = async () => {
        setFinalLoading(true);
        setFinalError("");

        try {
            const result = await runAssessment(session.id);
            setFinalResult(result);
        } catch (err) {
            console.error(err);
            setFinalError("Failed to generate final assessment.");
        } finally {
            setFinalLoading(false);
        }
    };

    const goNext = () => {
        const next = Math.min(currentStep + 1, STEPS.length - 1);

        if (next === 3 && questions.length === 0 && !questionsLoading) {
            loadQuestions();
        }

        setCurrentStep(next);
    };

    const goBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    if (!started) {
        return (
            <div style={{ padding: "20px", maxWidth: "400px" }}>
                <h2>Start Assessment</h2>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <div style={{ marginBottom: "10px" }}>
                    <label>Candidate Name</label>
                    <br />
                    <input
                        type="text"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Email (optional)</label>
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button onClick={handleStart} disabled={loading}>
                    {loading ? "Starting..." : "Start Assessment"}
                </button>
            </div>
        );
    }

    const renderStepContent = () => {
        if (currentStep === 0) {
            return (
                <div>
                    <h3>Upload Your Resume</h3>

                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                    />

                    <br />
                    <br />

                    <button
                        onClick={handleResumeUpload}
                        disabled={resumeUploading}
                    >
                        {resumeUploading ? "Uploading..." : "Upload Resume"}
                    </button>

                    {resumeError && (
                        <p style={{ color: "red" }}>{resumeError}</p>
                    )}

                    {resumeProfile && (
                        <ResumeCard profile={resumeProfile} />
                    )}
                </div>
            );
        }

        if (currentStep === 1) {
            return (
                <div>
                    <h3>Record Your Answer</h3>

                    {!recording ? (
                        <button onClick={startRecording}>
                            Start Recording
                        </button>
                    ) : (
                        <button onClick={stopRecording}>
                            Stop Recording
                        </button>
                    )}

                    {audioUploading && <p>Analyzing audio...</p>}

                    {audioError && (
                        <p style={{ color: "red" }}>{audioError}</p>
                    )}

                    {audioAnalytics && (
                        <VoiceDashboard analytics={audioAnalytics} />
                    )}
                </div>
            );
        }

        if (currentStep === 2) {
            return (
                <div>
                    <h3>Capture Your Video Frame</h3>

                    {!cameraOn ? (
                        <button onClick={startCamera}>
                            Start Camera
                        </button>
                    ) : (
                        <button
                            onClick={captureFrame}
                            disabled={visionUploading}
                        >
                            {visionUploading
                                ? "Analyzing..."
                                : "Capture Frame"}
                        </button>
                    )}

                    <br />
                    <br />

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        width="480"
                        height="360"
                        style={{
                            border: "2px solid #ccc",
                            borderRadius: "10px",
                            display: cameraOn ? "block" : "none",
                        }}
                    />

                    <canvas
                        ref={canvasRef}
                        style={{ display: "none" }}
                    />

                    {visionError && (
                        <p style={{ color: "red" }}>{visionError}</p>
                    )}

                    {visionResult && (
                        <VisionDashboard result={visionResult} />
                    )}
                </div>
            );
        }

        if (currentStep === 3) {
            return (
                <div>
                    <h3>Interview Question</h3>

                    {questionsLoading && <p>Loading questions...</p>}

                    {questionsError && (
                        <p style={{ color: "red" }}>{questionsError}</p>
                    )}

                    {questions.length > 0 && (
                        <>
                            <p>
                                <strong>Q:</strong> {questions[0]}
                            </p>

                            <textarea
                                rows="5"
                                style={{ width: "100%" }}
                                value={candidateAnswer}
                                onChange={(e) =>
                                    setCandidateAnswer(e.target.value)
                                }
                                disabled={answerSubmitted}
                            />

                            <br />
                            <br />

                            <button
                                onClick={handleSubmitAnswer}
                                disabled={answerSubmitting || answerSubmitted}
                            >
                                {answerSubmitted
                                    ? "Answer Submitted"
                                    : answerSubmitting
                                        ? "Submitting..."
                                        : "Submit Answer"}
                            </button>

                            {answerError && (
                                <p style={{ color: "red" }}>{answerError}</p>
                            )}
                        </>
                    )}
                </div>
            );
        }

        if (currentStep === 4) {
            return (
                <div>
                    <h3>Final Assessment</h3>

                    <button
                        onClick={handleRunAssessment}
                        disabled={finalLoading}
                    >
                        {finalLoading
                            ? "Generating..."
                            : "Generate Final Assessment"}
                    </button>

                    {finalError && (
                        <p style={{ color: "red" }}>{finalError}</p>
                    )}

                    {finalResult && (
                        <FusionDashboard result={finalResult} />
                    )}
                </div>
            );
        }

        return null;
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Assessment — Session #{session.id}</h2>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px",
                }}
            >
                {STEPS.map((stepName, index) => (
                    <div
                        key={stepName}
                        style={{
                            padding: "8px 14px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            fontWeight:
                                index === currentStep ? "bold" : "normal",
                            background:
                                index === currentStep ? "#ddeeff" : "transparent",
                        }}
                    >
                        {index + 1}. {stepName}
                    </div>
                ))}
            </div>

            <div
                style={{
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    minHeight: "200px",
                }}
            >
                {renderStepContent()}
            </div>

            <div style={{ marginTop: "20px" }}>
                <button onClick={goBack} disabled={currentStep === 0}>
                    Back
                </button>{" "}
                <button
                    onClick={goNext}
                    disabled={currentStep === STEPS.length - 1}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default InterviewFlow;