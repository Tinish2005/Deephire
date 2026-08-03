import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const uploadResume = async (file) => {
    const formData = new FormData();

    formData.append("resume", file);

    const response = await axios.post(
        `${API_URL}/resume/upload`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};