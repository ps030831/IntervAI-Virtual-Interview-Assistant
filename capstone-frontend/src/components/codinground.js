import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './codinground.css'; // Import CSS file for styling

const CodingRound = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [code, setCode] = useState("");
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    // Fetch coding questions from the server
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:5000/api/coding');
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

    // Timer logic
    useEffect(() => {
        if (timer === 0) {
            handleSubmit(); // Automatically submit when timer reaches 0
        }

        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    // Submit code
    const handleSubmit = async () => {
        if (code.trim() === "") {
            alert("Please write some code before submitting.");
            return;
        }

        try {
            const currentQuestion = questions[currentQuestionIndex];
            const res = await axios.post('http://127.0.0.1:5000/api/submit/coding', {
                [currentQuestionIndex]: code // Send code with index for identification
            });

            // Save result for this question based on backend feedback
            const feedback = res.data.results[currentQuestionIndex]?.passed ? "Passed" : "Failed";
            setResults(prevResults => [
                ...prevResults,
                { question: currentQuestion.question, feedback }
            ]);

            setIsSubmitted(true);

            // Move to the next question or finish if last question
            if (currentQuestionIndex < questions.length - 1) {
                handleNextQuestion();
            } else {
                alert("Coding round completed!");
                handleFinish();
            }
        } catch (err) {
            console.error("Error submitting code:", err);
            alert("Error submitting code. Please try again.");
        }
    };

    // Move to the next question
    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setTimer(300); // Reset timer for next question
        setCode(""); // Clear code input
        setIsSubmitted(false);
    };

    // Finish coding round and navigate to summary or result page
    const handleFinish = () => {
        navigate('/summary', { state: { results } });
    };

    // Render loading or no questions message if necessary
    if (questions.length === 0) {
        return <div className="quiz-container">Loading questions...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <h1>Coding Round</h1>
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

            {/* Display "Finish" button on the last question */}
            {currentQuestionIndex === questions.length - 1 && (
                <button className="finish-button" onClick={handleFinish}>
                    Finish
                </button>
            )}
        </div>
    );
};

export default CodingRound;
