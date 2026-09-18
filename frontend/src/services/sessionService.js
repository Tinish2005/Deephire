import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const createSession = async (candidateName, email) => {
    const response = await axios.post(
        `${API_URL}/session/create`,
        {
            candidate_name: candidateName,
            email: email,
        }
    );

    return response.data;
};

export const getInterviewQuestions = async (sessionId) => {
    const response = await axios.get(
        `${API_URL}/interview/session/${sessionId}`
    );

    return response.data;
};

export const submitAnswer = async (sessionId, questionText, candidateAnswer) => {
    const response = await axios.post(
        `${API_URL}/session/${sessionId}/answer`,
        {
            question_text: questionText,
            expected_answer: "",
            candidate_answer: candidateAnswer,
        }
    );

    return response.data;
};

export const runAssessment = async (sessionId) => {
    const response = await axios.post(
        `${API_URL}/assessment/run`,
        {
            session_id: sessionId,
        }
    );

    return response.data;
};