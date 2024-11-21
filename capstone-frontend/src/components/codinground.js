
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './codinground.css';

const CodingRound = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [code, setCode] = useState("");
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const user_id = searchParams.get('user_id');

    // Fetch coding questions from the server
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8080/api/coding');
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    setQuestions(res.data);
                } else {
                    alert("No coding questions received from the server.");
                }
            } catch (err) {
                console.error("Error fetching coding questions:", err);
                alert("Error fetching questions. Please try again.");
            }
        };
        fetchQuestions();
    }, []);

    // Timer logic with useEffect
    useEffect(() => {

        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
        }, 1000);
        if (timer === 0) {
            clearInterval(interval)
            handleSubmit(); // Automatically submit when timer reaches 0
        }

        return () => clearInterval(interval);
    }, [timer]);



    const handleSubmit = useCallback(async () => {
        if (code.trim() === "") {
            alert("Please write some code before submitting.");
            return;
        }
    
        try {
            const currentQuestion = questions[currentQuestionIndex];
            const res = await axios.post('http://127.0.0.1:8080/api/submit/coding', {
                questions: [currentQuestion.question], // Send the current question
                answers: [code],  // Send the code for the current question
                user_id: localStorage.getItem("userid")  // Ensure the user_id is fetched correctly
            });
    
            // If invalid code, set 0 and don't show it on the UI
            const feedback = res.data; // Adjust based on your response structure
            // if (feedback.total_score === 0) {
            //     alert("Invalid code answer. Please provide valid code.");
            //     return;
            // }
    
            const feedbackDetails = {
                question: { text: currentQuestion.question },
                code: code,
                score: feedback.total_score, // Assuming `total_score` is returned
                feedback:feedback.feedback
            };
    
            setResults(prevResults => {
                const updatedResults = [...prevResults, feedbackDetails];
                sessionStorage.setItem('results', JSON.stringify(updatedResults)); // Store results
                return updatedResults;
            });
    
            setIsSubmitted(true);
    
            // Move to the next question or generate the report if it's the last one
            if (currentQuestionIndex < questions.length - 1) {
                handleNextQuestion();
            } else {
                generateReportAndNavigate();
            }
        } catch (err) {
            console.error("Error submitting code:", err);
            alert("Error submitting code. Please try again.");
        }
    }, [code, currentQuestionIndex, questions]);

    
    // Move to the next question
    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setTimer(300); // Reset timer for next question
        setCode(""); // Clear code input
        setIsSubmitted(false);
    };


const generateReportAndNavigate = async () => {
    try {
        const res = await axios.post('http://127.0.0.1:8080/api/generate_report', {
            results,
            user_id: localStorage.getItem("userid") // Pass user_id here
        });
        
        const { file_path } = res.data;
        sessionStorage.setItem('filePath', file_path);
        navigate('/summary', { state: { filePath: file_path } });
    } catch (err) {
        console.error("Error generating report:", err.response || err.message);
        alert("Error generating the assessment report.");
    }
};




    // Render loading or no questions message if necessary
    if (questions.length === 0) {
        return <div className="quiz-container">Loading questions...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];
    console.log(currentQuestion)
    return (
        
        <div className="quiz-container">
            <h1>Coding Round</h1>
            <h2>Round 4</h2>
            <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
            <p>{currentQuestion.question}</p>

            <textarea
                className="code-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here..."
                rows="10"
            />

            <div className="timer">
                Time Left: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
            </div>

            <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={isSubmitted}
            >
                Submit
            </button>

{/* Display feedback */}
{results[currentQuestionIndex] && (
    <div className="feedback-section">
        <h2>Feedback for Question {currentQuestionIndex + 1}:</h2>
        
        <p>Score: {results[currentQuestionIndex].score || "N/A"}/10</p>
        
        {results[currentQuestionIndex].feedback && (
            <>
                <div>
                    <h3>Feedback Details:</h3>
                    {results[currentQuestionIndex].feedback.details && results[currentQuestionIndex].feedback.details.length > 0 ? (
                        results[currentQuestionIndex].feedback.details.map((item, index) => (
                            <p key={index}>{item.feedback}</p>
                        ))
                    ) : (
                        <p>No additional feedback details.</p>
                    )}
                </div>

                {results[currentQuestionIndex].feedback.efficiency_feedback && (
                    <div>
                        <h3>Efficiency Feedback:</h3>
                        <p>{results[currentQuestionIndex].feedback.efficiency_feedback}</p>
                    </div>
                )}

                {results[currentQuestionIndex].feedback.quality_feedback && (
                    <div>
                        <h3>Code Quality Feedback:</h3>
                        <p>{results[currentQuestionIndex].feedback.quality_feedback}</p>
                    </div>
                )}
            </>
        )}
    </div>
)}


        </div>
    );
};

export default CodingRound;


