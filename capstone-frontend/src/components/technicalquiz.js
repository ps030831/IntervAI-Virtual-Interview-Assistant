
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import './technicalquiz.css';

// const TechnicalQuiz = () => {
//     const [questions, setQuestions] = useState([]);
//     const [answers, setAnswers] = useState({});
//     const [score, setScore] = useState(null);
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();
//     const [searchParams, setSearchParams] = useSearchParams();
//     const user_id = searchParams.get('user_id');


//     // Fetch questions from the server
//     useEffect(() => {
//         const fetchQuestions = async () => {
//             try {
//                 setIsLoading(true);
//                 const res = await axios.get('http://127.0.0.1:8080/api/technical');
//                 if (res.data && Array.isArray(res.data) && res.data.length > 0) {
//                     setQuestions(res.data);
//                 } else {
//                     setError('No questions received from the server');
//                 }
//             } catch (err) {
//                 setError('Error fetching questions. Please try again later.');
//                 console.error(err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchQuestions();
//     }, []);

//     // Handle the answer selection
//     const handleAnswerChange = (qIndex, answer) => {
//         setAnswers(prevAnswers => ({
//             ...prevAnswers,
//             [qIndex]: answer
//         }));
//     };

//     // Submit answers to the server
//     const handleSubmit = async () => {
//         if (Object.keys(answers).length !== questions.length) {
//             alert("Please answer all questions before submitting.");
//             return;
//         }

//         try {
//             const res = await axios.post('http://127.0.0.1:8080/api/submit/technical', {answers, user_id});
//             setScore(res.data.score);
//             setIsSubmitted(true);
//         } catch (err) {
//             alert('Error submitting answers. Please try again.');
//             console.error(err);
//         }
//     };

//     // Handle the proceed action to the next round
//     const handleProceed = () => {
//         navigate('/coding');
//     };




    
//     // Loading state
//     if (isLoading) {
//         return (
//             <div className="quiz-container">
//                 <h1>Round 3</h1>
//                 <p>Loading questions...</p>
//             </div>
//         );
//     }

//     // Error state
//     if (error) {
//         return (
//             <div className="quiz-container">
//                 <h1>Round 3</h1>
//                 <p className="error-message">{error}</p>
//                 <button onClick={() => window.location.reload()}>Retry</button>
//             </div>
//         );
//     }

//     return (
//         <div className="quiz-container">
//             <h1>Round 3</h1>
//             <h2>Technical Round</h2>
//             {questions.map((q, index) => (
//                 <div key={index} className="question-card">
//                     <p className="question-text">{q.question}</p>
//                     <div className="options-container">
//                         {q.options.map((option, i) => (
//                             <label key={i} className="option-label">
//                                 <input
//                                     type="radio"
//                                     name={`question-${index}`}
//                                     value={option}
//                                     onChange={() => handleAnswerChange(index, option)}
//                                     disabled={isSubmitted}
//                                     checked={answers[index] === option}
//                                 />
//                                 <span className="option-text">{option}</span>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             ))}
            
//             <button 
//                 className="submit-button" 
//                 onClick={handleSubmit} 
//                 disabled={isSubmitted || Object.keys(answers).length !== questions.length}
//             >
//                 Submit
//             </button>
            
//             {score !== null && (
//                 <div className="result-container">
//                     <p className="score-text">
//                         You have scored {score.toFixed(1)}%. 
//                         You are {score >= 80 ? "eligible" : "not eligible"} for the next round.
//                     </p>
//                 </div>
//             )}
            
//             {score >= 80 && isSubmitted && (
//                 <button className="proceed-button" onClick={handleProceed}>
//                     Proceed to Coding Round
//                 </button>
//             )}
//         </div>
//     );
// };

// export default TechnicalQuiz;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import './technicalquiz.css';

// const TechnicalQuiz = () => {
//     const [questions, setQuestions] = useState([]);
//     const [answers, setAnswers] = useState({});
//     const [score, setScore] = useState(null);
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [timeLeft, setTimeLeft] = useState(600);  // 10 minutes timer (600 seconds)
//     const navigate = useNavigate();
//     const [searchParams] = useSearchParams();
//     const user_id = searchParams.get('user_id');

//     // Fetch questions from the server
//     useEffect(() => {
//         const fetchQuestions = async () => {
//             try {
//                 setIsLoading(true);
//                 const userid= localStorage.getItem("userid")
//                 const res = await axios.get(`http://127.0.0.1:8080/api/technical?user_id=${userid}`);
//                 if (res.data && Array.isArray(res.data) && res.data.length > 0) {
//                     setQuestions(res.data);
//                 } else {
//                     setError('No questions received from the server');
//                 }
//             } catch (err) {
//                 setError('Error fetching questions. Please try again later.');
//                 console.error(err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchQuestions();
//     }, []);

//     // Timer countdown
//     useEffect(() => {
//         let timer;
//         if (timeLeft > 0 && !isSubmitted) {
//             timer = setInterval(() => {
//                 setTimeLeft(prev => prev - 1);  // Decrease by 1 every second
//             }, 1000);
//         } else if (timeLeft === 0 && !isSubmitted) {
//             handleSubmit();  // Automatically submit when time runs out
//         }
//         return () => clearInterval(timer);
//     }, [timeLeft, isSubmitted]);

//     // Handle the answer selection
//     const handleAnswerChange = (qIndex, answer) => {
//         setAnswers(prevAnswers => ({
//             ...prevAnswers,
//             [qIndex]: answer
//         }));
//     };

//     // Submit answers to the server
//     const handleSubmit = async () => {
//         // Automatically submit without checking if all questions are answered
//         try {
//             const res = await axios.post('http://127.0.0.1:8080/api/submit/technical', { answers, user_id });
//             setScore(res.data.score);
//             setIsSubmitted(true);
//         } catch (err) {
//             alert('Error submitting answers. Please try again.');
//             console.error(err);
//         }
//     };

//     // Proceed to the next round
//     const handleProceed = () => {
//         navigate('/coding');
//     };

//     // Timer formatted as MM:SS
//     const formatTime = (time) => {
//         const minutes = Math.floor(time / 60);
//         const seconds = time % 60;
//         return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
//     };

//     // Loading state
//     if (isLoading) {
//         return (
//             <div className="quiz-container">
//                 <h1>Round 3</h1>
//                 <p>Loading questions...</p>
//             </div>
//         );
//     }

//     // Error state
//     if (error) {
//         return (
//             <div className="quiz-container">
//                 <h1>Round 3</h1>
//                 <p className="error-message">{error}</p>
//                 <button onClick={() => window.location.reload()}>Retry</button>
//             </div>
//         );
//     }

//     return (
//         <div className="quiz-container">
//             <h1>Round 3</h1>
//             <h2>Technical Round</h2>

//             {/* Timer display */}
//             <div className="timer-container">
//                 <p>Time Left: {formatTime(timeLeft)}</p>  {/* Display formatted timer */}
//             </div>

//             {questions.map((q, index) => (
//                 <div key={index} className="question-card">
//                     <p className="question-text">{q.question}</p>
//                     <div className="options-container">
//                         {q.options.map((option, i) => (
//                             <label key={i} className="option-label">
//                                 <input
//                                     type="radio"
//                                     name={`question-${index}`}
//                                     value={option}
//                                     onChange={() => handleAnswerChange(index, option)}
//                                     disabled={isSubmitted}
//                                     checked={answers[index] === option}
//                                 />
//                                 <span className="option-text">{option}</span>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             ))}

//             <button
//                 className="submit-button"
//                 onClick={handleSubmit}
//                 disabled={isSubmitted || Object.keys(answers).length !== questions.length}
//             >
//                 Submit
//             </button>

//             {score !== null && (
//                 <div className="result-container">
//                     <p className="score-text">
//                         You have scored {score.toFixed(1)}%. 
//                         You are {score >= 80 ? "eligible" : "not eligible"} for the next round.
//                     </p>
//                 </div>
//             )}

//             {score >= 80 && isSubmitted && (
//                 <button className="proceed-button" onClick={handleProceed}>
//                     Proceed to Coding Round
//                 </button>
//             )}
//         </div>
//     );
// };

// export default TechnicalQuiz;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './technicalquiz.css';

const TechnicalQuiz = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(600);  // 10 minutes timer (600 seconds)
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const user_id = searchParams.get('user_id');

    // Fetch questions from the server
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setIsLoading(true);
                const userid= localStorage.getItem("userid")
                const res = await axios.get(`http://127.0.0.1:8080/api/technical?user_id=${userid}`);
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    setQuestions(res.data);
                } else {
                    setError('No questions received from the server');
                }
            } catch (err) {
                setError('Error fetching questions. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    // Timer countdown
    useEffect(() => {
        let timer;
        if (timeLeft > 0 && !isSubmitted) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);  // Decrease by 1 every second
            }, 1000);
        } else if (timeLeft === 0 && !isSubmitted) {
            handleSubmit();  // Automatically submit when time runs out
        }
        return () => clearInterval(timer);
    }, [timeLeft, isSubmitted]);

    // Handle the answer selection
    const handleAnswerChange = (qIndex, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [qIndex]: answer
        }));
    };

    // Submit answers to the server
    const handleSubmit = async () => {
        // Automatically submit without checking if all questions are answered
        try {
            const res = await axios.post('http://127.0.0.1:8080/api/submit/technical', { answers, user_id });
            setScore(res.data.score);
            setIsSubmitted(true);
        } catch (err) {
            alert('Error submitting answers. Please try again.');
            console.error(err);
        }
    };

        // Proceed to the next round
    const handleProceed = () => {
        const userid = localStorage.getItem("userid");
        navigate(`/coding?user_id=${userid}`);
    };

    // Timer formatted as MM:SS
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="quiz-container">
                <h1>Round 3</h1>
                <p>Loading questions...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="quiz-container">
                <h1>Round 3</h1>
                <p className="error-message">{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="quiz-container">
            <h1>Round 3</h1>
            <h2>Technical Round</h2>

            {/* Timer display */}
            <div className="timer-container">
                <p>Time Left: {formatTime(timeLeft)}</p>  {/* Display formatted timer */}
            </div>

            {questions.map((q, index) => (
                <div key={index} className="question-card">
                    <p className="question-text">{q.question}</p>
                    <div className="options-container">
                        {q.options.map((option, i) => (
                            <label key={i} className="option-label">
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value={option}
                                    onChange={() => handleAnswerChange(index, option)}
                                    disabled={isSubmitted}
                                    checked={answers[index] === option}
                                />
                                <span className="option-text">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={isSubmitted || Object.keys(answers).length !== questions.length}
            >
                Submit
            </button>

            {score !== null && (
                <div className="result-container">
                    <p className="score-text">
                        You have scored {score.toFixed(1)}%. 
                        You are {score >= 80 ? "eligible" : "not eligible"} for the next round.
                    </p>
                </div>
            )}

            {score >= 80 && isSubmitted && (
                <button className="proceed-button" onClick={handleProceed}>
                    Proceed to Coding Round
                </button>
            )}
        </div>
    );
};

export default TechnicalQuiz;