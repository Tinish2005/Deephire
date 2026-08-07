import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const evaluateAnswer = async (
    question,
    answer
) => {

    const response = await axios.post(
        `${API_URL}/evaluation/score`,
        {
            question,
            answer
        }
    );

    return response.data;
};