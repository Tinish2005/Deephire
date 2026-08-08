export const stopCameraStream = (
    videoRef
) => {

    const stream =
        videoRef.current?.srcObject;

    if (!stream) {
        return;
    }

    stream
        .getTracks()
        .forEach(
            track => track.stop()
        );

    videoRef.current.srcObject = null;
};