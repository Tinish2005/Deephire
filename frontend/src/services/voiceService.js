export const downloadRecording = (
    audioBlob
) => {

    const url =
        URL.createObjectURL(
            audioBlob
        );

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "answer.webm";

    a.click();

    URL.revokeObjectURL(url);
};