import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const analyzeAudio = async (file, sessionId) => {
    const formData = new FormData();

    formData.append("audio", file);
    formData.append("session_id", sessionId);

    const response = await axios.post(
        `${API_URL}/audio/analytics`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};