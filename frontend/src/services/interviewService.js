import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const getInterviewQuestions = async () => {
    const response = await axios.get(
        `${API_URL}/interview/demo`
    );

    return response.data;
};