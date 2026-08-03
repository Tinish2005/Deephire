import { useEffect, useState } from "react";

import { getInterviewQuestions }
    from "../services/interviewService";

function Interview() {

    const [questions, setQuestions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const loadQuestions =
            async () => {

                try {

                    const response =
                        await getInterviewQuestions();

                    setQuestions(
                        response.questions
                    );

                } catch (error) {

                    console.error(error);

                } finally {

                    setLoading(false);

                }
            };

        loadQuestions();

    }, []);

    if (loading) {

        return (
            <h2>
                Generating Interview...
            </h2>
        );
    }

    return (
        <div
            style={{
                padding: "30px"
            }}
        >
            <h1>
                Interview Questions
            </h1>

            {
                questions.map(
                    (question, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: "15px",
                                padding: "15px",
                                border: "1px solid #ddd",
                                borderRadius: "10px"
                            }}
                        >
                            <strong>
                                Question {index + 1}
                            </strong>

                            <p>
                                {question}
                            </p>
                        </div>
                    )
                )
            }
        </div>
    );
}

export default Interview;