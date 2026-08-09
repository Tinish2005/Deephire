import axios from "axios";

const API_URL =
    "http://127.0.0.1:8000";

export const assessCandidate =
    async (data) => {

        const response =
            await axios.post(
                `${API_URL}/fusion/assess`,
                data
            );

        return response.data;
    };