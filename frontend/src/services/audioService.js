import axios from "axios";

const API_URL =
    "http://127.0.0.1:8000";

export const analyzeAudio =
    async (audioFile) => {

        const formData =
            new FormData();

        formData.append(
            "audio",
            audioFile
        );

        const response =
            await axios.post(
                `${API_URL}/audio/analytics`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );

        return response.data;
    };