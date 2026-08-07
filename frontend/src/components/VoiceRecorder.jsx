import { useState, useRef } from "react";

import {
    downloadRecording
} from "../services/voiceService";

import {
    analyzeAudio
} from "../services/audioService";

import VoiceDashboard
    from "./VoiceDashboard";

function VoiceRecorder() {

    const [recording,
        setRecording] =
            useState(false);

    const [audioUrl,
        setAudioUrl] =
            useState(null);

    const [analytics,
        setAnalytics] =
            useState(null);

    const mediaRecorderRef =
        useRef(null);

    const chunksRef =
        useRef([]);

    const startRecording =
        async () => {

            const stream =
                await navigator
                    .mediaDevices
                    .getUserMedia({
                        audio: true
                    });

            const recorder =
                new MediaRecorder(
                    stream
                );

            chunksRef.current = [];

            recorder.ondataavailable =
                (event) => {

                    chunksRef.current.push(
                        event.data
                    );
                };

            recorder.onstop =
                async () => {

                    const blob =
                        new Blob(
                            chunksRef.current,
                            {
                                type:
                                    "audio/webm"
                            }
                        );

                    const url =
                        URL.createObjectURL(
                            blob
                        );

                    setAudioUrl(url);

                    window.latestAudioBlob =
                        blob;

                    try {

                        const audioFile =
                            new File(
                                [blob],
                                "audio.webm"
                            );

                        const result =
                            await analyzeAudio(
                                audioFile
                            );

                        setAnalytics(
                            result
                        );

                    } catch (error) {

                        console.error(
                            error
                        );
                    }
                };

            mediaRecorderRef.current =
                recorder;

            recorder.start();

            setRecording(true);
        };

    const stopRecording =
        () => {

            mediaRecorderRef.current.stop();

            setRecording(false);
        };

    const downloadAudio =
        () => {

            if (
                window.latestAudioBlob
            ) {

                downloadRecording(
                    window
                        .latestAudioBlob
                );
            }
        };

    return (
        <div
            style={{
                padding: "20px"
            }}
        >
            <h2>
                Voice Recorder
            </h2>

            {
                !recording ? (

                    <button
                        onClick={
                            startRecording
                        }
                    >
                        Start Recording
                    </button>

                ) : (

                    <button
                        onClick={
                            stopRecording
                        }
                    >
                        Stop Recording
                    </button>

                )
            }

            {
                audioUrl && (
                    <>
                        <br />
                        <br />

                        {audioUrl}

                        <br />
                        <br />

                        <button
                            onClick={
                                downloadAudio
                            }
                        >
                            Download Audio
                        </button>

                        <VoiceDashboard
                            analytics={
                                analytics
                            }
                        />
                    </>
                )
            }

        </div>
    );
}

export default VoiceRecorder;