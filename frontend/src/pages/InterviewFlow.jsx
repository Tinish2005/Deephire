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

    const [allQuestions, setAllQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [questionsError, setQuestionsError] = useState("");
    const [candidateAnswer, setCandidateAnswer] = useState("");
    const [answerSubmitting, setAnswerSubmitting] = useState(false);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [answerError, setAnswerError] = useState("");
    const [allAnswered, setAllAnswered] = useState(false);

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
                const combined = [
                    ...data.technical,
                    ...data.behavioral,
                ];
                setAllQuestions(combined);
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
            await submitAnswer(
                session.id,
                allQuestions[questionIndex].question,
                allQuestions[questionIndex].answer,
                candidateAnswer
            );

            const nextIndex = questionIndex + 1;
            setAnsweredCount(nextIndex);
            setCandidateAnswer("");

            if (nextIndex >= allQuestions.length) {
                setAllAnswered(true);
            } else {
                setQuestionIndex(nextIndex);
            }
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

        if (next === 3 && allQuestions.length === 0 && !questionsLoading) {
            loadQuestions();
        }

        setCurrentStep(next);
    };

    const goBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    if (!started) {
        return (
            <div className="dh-page" style={{ maxWidth: "420px" }}>
                <h2>Start Assessment</h2>
                <p className="dh-subtitle">
                    Enter your name to begin a full interview assessment.
                </p>

                {error && <p className="dh-error">{error}</p>}

                <div className="dh-field">
                    <label className="dh-label">Candidate Name</label>
                    <input
                        type="text"
                        className="dh-input"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                    />
                </div>

                <div className="dh-field">
                    <label className="dh-label">Email (optional)</label>
                    <input
                        type="email"
                        className="dh-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <button className="dh-btn" onClick={handleStart} disabled={loading}>
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
                        className="dh-btn"
                        onClick={handleResumeUpload}
                        disabled={resumeUploading}
                    >
                        {resumeUploading ? "Uploading..." : "Upload Resume"}
                    </button>

                    {resumeError && <p className="dh-error">{resumeError}</p>}

                    {resumeProfile && <ResumeCard profile={resumeProfile} />}
                </div>
            );
        }

        if (currentStep === 1) {
            return (
                <div>
                    <h3>Record Your Answer</h3>

                    {!recording ? (
                        <button className="dh-btn" onClick={startRecording}>
                            Start Recording
                        </button>
                    ) : (
                        <button className="dh-btn dh-btn-secondary" onClick={stopRecording}>
                            Stop Recording
                        </button>
                    )}

                    {audioUploading && <p className="dh-subtitle">Analyzing audio...</p>}

                    {audioError && <p className="dh-error">{audioError}</p>}

                    {audioAnalytics && <VoiceDashboard analytics={audioAnalytics} />}
                </div>
            );
        }

        if (currentStep === 2) {
            return (
                <div>
                    <h3>Capture Your Video Frame</h3>

                    {!cameraOn ? (
                        <button className="dh-btn" onClick={startCamera}>
                            Start Camera
                        </button>
                    ) : (
                        <button
                            className="dh-btn"
                            onClick={captureFrame}
                            disabled={visionUploading}
                        >
                            {visionUploading ? "Analyzing..." : "Capture Frame"}
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
                        className="dh-video"
                        style={{ display: cameraOn ? "block" : "none" }}
                    />

                    <canvas ref={canvasRef} style={{ display: "none" }} />

                    {visionError && <p className="dh-error">{visionError}</p>}

                    {visionResult && <VisionDashboard result={visionResult} />}
                </div>
            );
        }

        if (currentStep === 3) {
            const total = allQuestions.length || 1;
            const progressPct = Math.min((answeredCount / total) * 100, 100);

            return (
                <div>
                    <h3>Interview Questions</h3>

                    {questionsLoading && <p className="dh-subtitle">Loading questions...</p>}

                    {questionsError && <p className="dh-error">{questionsError}</p>}

                    {allQuestions.length > 0 && (
                        <div className="dh-progress-bar">
                            <div
                                className="dh-progress-fill"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    )}

                    {allAnswered && (
                        <p className="dh-success">
                            All {allQuestions.length} questions answered! Click "Next" to see your result.
                        </p>
                    )}

                    {!allAnswered && allQuestions.length > 0 && (
                        <>
                            <p className="dh-subtitle">
                                Question {questionIndex + 1} of {allQuestions.length}
                            </p>

                            <p>
                                <strong>Q:</strong> {allQuestions[questionIndex].question}
                            </p>

                            <textarea
                                rows="5"
                                className="dh-textarea"
                                value={candidateAnswer}
                                onChange={(e) => setCandidateAnswer(e.target.value)}
                            />

                            <br />
                            <br />

                            <button
                                className="dh-btn"
                                onClick={handleSubmitAnswer}
                                disabled={answerSubmitting}
                            >
                                {answerSubmitting
                                    ? "Submitting..."
                                    : questionIndex === allQuestions.length - 1
                                        ? "Submit Final Answer"
                                        : "Submit & Next Question"}
                            </button>

                            {answerError && <p className="dh-error">{answerError}</p>}
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
                        className="dh-btn"
                        onClick={handleRunAssessment}
                        disabled={finalLoading}
                    >
                        {finalLoading ? "Generating..." : "Generate Final Assessment"}
                    </button>

                    {finalError && <p className="dh-error">{finalError}</p>}

                    {finalResult && <FusionDashboard result={finalResult} />}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="dh-page">
            <h2>Assessment — Session #{session.id}</h2>

            <div className="dh-steps">
                {STEPS.map((stepName, index) => (
                    <div
                        key={stepName}
                        className={
                            index === currentStep ? "dh-step active" : "dh-step"
                        }
                    >
                        {index + 1}. {stepName}
                    </div>
                ))}
            </div>

            <div className="dh-card">{renderStepContent()}</div>

            <div style={{ marginTop: "20px" }}>
                <button
                    className="dh-btn dh-btn-secondary"
                    onClick={goBack}
                    disabled={currentStep === 0}
                >
                    Back
                </button>{" "}
                <button
                    className="dh-btn"
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