import axios from "axios";

const API_URL =
    "http://127.0.0.1:8000";

export const analyzeVision =
    async (imageFile, sessionId) => {

        const formData =
            new FormData();

        formData.append(
            "image",
            imageFile
        );

        formData.append(
            "session_id",
            sessionId
        );

        const response =
            await axios.post(
                `${API_URL}/vision/attention`,
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