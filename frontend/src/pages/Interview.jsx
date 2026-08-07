import { useEffect, useState } from "react";

import {
    getInterviewQuestions
} from "../services/interviewService";

import {
    evaluateAnswer
} from "../services/evaluationService";

function Interview() {

    const [questions, setQuestions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [answers, setAnswers] = useState({});

    useEffect(() => {

        const loadQuestions = async () => {

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

    const submitAnswer = async (
        question,
        index
    ) => {

        try {

            const answer =
                answers[index] || "";

            const result =
                await evaluateAnswer(
                    question,
                    answer
                );

            console.log(
                `Question ${index + 1} Result:`,
                result
            );

            alert(
                `Score: ${result.score}/10\n\nFeedback: ${result.feedback}`
            );

        } catch (error) {

            console.error(error);

            alert(
                "Answer evaluation failed."
            );
        }
    };

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
                                marginBottom: "20px",
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

                            <textarea
                                rows="4"
                                style={{
                                    width: "100%"
                                }}
                                value={
                                    answers[index] || ""
                                }
                                onChange={(e) =>
                                    setAnswers({
                                        ...answers,
                                        [index]:
                                            e.target.value
                                    })
                                }
                            />

                            <br />
                            <br />

                            <button
                                onClick={() =>
                                    submitAnswer(
                                        question,
                                        index
                                    )
                                }
                            >
                                Submit Answer
                            </button>

                        </div>
                    )
                )
            }

        </div>
    );
}

export default Interview;