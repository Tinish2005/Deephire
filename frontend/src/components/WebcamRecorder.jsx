import { useState, useRef }
    from "react";

import {
    stopCameraStream
}
from "../services/cameraService";

function WebcamRecorder() {

    const [cameraOn,
        setCameraOn] =
            useState(false);

    const videoRef =
        useRef(null);

    const startCamera =
        async () => {

            try {

                const stream =
                    await navigator
                        .mediaDevices
                        .getUserMedia({
                            video: true
                        });

                videoRef.current.srcObject =
                    stream;

                setCameraOn(true);

            } catch (error) {

                console.error(error);

                alert(
                    "Camera access denied."
                );
            }
        };

    const stopCamera =
        () => {

            stopCameraStream(
                videoRef
            );

            setCameraOn(false);
        };

    return (
        <div
            style={{
                padding: "20px"
            }}
        >
            <h2>
                Webcam Recorder
            </h2>

            {
                !cameraOn ? (

                    <button
                        onClick={
                            startCamera
                        }
                    >
                        Start Camera
                    </button>

                ) : (

                    <button
                        onClick={
                            stopCamera
                        }
                    >
                        Stop Camera
                    </button>

                )
            }

            <br />
            <br />

            <video
                ref={videoRef}
                autoPlay
                playsInline
                width="640"
                height="480"
                style={{
                    border:
                        "2px solid #ccc",
                    borderRadius:
                        "10px"
                }}
            />
        </div>
    );
}

export default WebcamRecorder;