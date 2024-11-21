

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import './aptitudequiz.css';

// const AptitudeQuiz = () => {
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
//                 const res = await axios.get('http://127.0.0.1:8080/api/aptitude');
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
//             [qIndex]: answer  // Associate each question index with the selected answer
//         }));
//     };

//     // Submit answers to the server
//     const handleSubmit = async () => {
//         if (Object.keys(answers).length !== questions.length) {
//             alert("Please answer all questions before submitting.");
//             return;
//         }

//         try {
//             const res = await axios.post('http://127.0.0.1:8080/api/submit/aptitude', {answers, user_id});
//             setScore(res.data.score);
//             setIsSubmitted(true);
//         } catch (err) {
//             alert('Error submitting answers. Please try again.');
//             console.error(err);
//         }
//     };



//   const handleProceed = () => {
//     const userid= localStorage.getItem("userid")
//     navigate(`/technical?user_id=${userid}`);
// };

//     // Loading state
//     if (isLoading) {
//         return (
//             <div className="quiz-container">
//                 <h1>Round 2</h1>
//                 <h2>Aptitude Round</h2>
//                 <p>Loading questions...</p>
//             </div>
//         );
//     }

//     // Error state
//     if (error) {
//         return (
//             <div className="quiz-container">
//                 <h1>Round 2</h1>
//                 <h2>Aptitude Round</h2>
//                 <p className="error-message">{error}</p>
//                 <button onClick={() => window.location.reload()}>Retry</button>
//             </div>
//         );
//     }

//     return (
//         <div className="quiz-container">
//             <h1>Round 2</h1>
//             <h2>Aptitude Round</h2>
//             {questions.map((q, index) => (
//                 <div key={index} className="question-card">
//                     <p className="question-text">{q.question}</p>
//                     <div className="options-container">
//                         {q.options.map((option, i) => (
//                             <label key={i} className="option-label">
//                                 <input
//                                     type="radio"
//                                     name={`question-${index}`}  // Unique name for each question to allow independent selection
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
//                 disabled={isSubmitted || Object.keys(answers).length !== questions.length}  // Disable if not all questions answered
//             >
//                 Submit
//             </button>
            
//             {score !== null && (
//                 <div className="result-container">
//                     <p className="score-text">
//                         You have scored {score.toFixed(1)}%. 
//                         You are {score >= 70 ? "applicable" : "not applicable"} for the next round.
//                     </p>
//                 </div>
//             )}
            
//             {score >= 70 && isSubmitted && (
//                 <button className="proceed-button" onClick={handleProceed}>
//                     Proceed to Technical Round
//                 </button>
//             )}
//         </div>
//     );
// };

// export default AptitudeQuiz;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import './aptitudequiz.css';

// const AptitudeQuiz = () => {
//     const [questions, setQuestions] = useState([]);
//     const [answers, setAnswers] = useState({});
//     const [score, setScore] = useState(null);
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [timeLeft, setTimeLeft] = useState(600);  // 10 minutes timer
//     const navigate = useNavigate();
//     const [searchParams] = useSearchParams();
//     const user_id = searchParams.get('user_id');

//     // Fetch questions from the server
//     useEffect(() => {
//         const fetchQuestions = async () => {
//             try {
//                 setIsLoading(true);
//                 const res = await axios.get('http://127.0.0.1:8080/api/aptitude');
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
//             [qIndex]: answer  // Associate each question index with the selected answer
//         }));
//     };

//     // Submit answers to the server
//     const handleSubmit = async () => {
//         if (Object.keys(answers).length !== questions.length) {
//             // This logic is removed so that it doesn't show alert if answers are missing
//             //alert("Please answer all questions before submitting.");
//             setAnswers(answers); // Submit the answers even if some are missing.
//         }

//         try {
//             const res = await axios.post('http://127.0.0.1:8080/api/submit/aptitude', { answers, user_id });
//             setScore(res.data.score);
//             setIsSubmitted(true);
//         } catch (err) {
//             alert('Error submitting answers. Please try again.');
//             console.error(err);
//         }
//     };

//     // Proceed to the next round
//     const handleProceed = () => {
//         const userid = localStorage.getItem("userid");
//         navigate(`/technical?user_id=${userid}`);
//     };

//     // Loading state
//     if (isLoading) {
//         return (
//             <div className="quiz-container">
//                 <h1>Round 2</h1>
//                 <h2>Aptitude Round</h2>
//                 <p>Loading questions...</p>
//             </div>
//         );
//     }

//     // Error state
//     if (error) {
//         return (
//             <div className="quiz-container">
//                 <h1>Round 2</h1>
//                 <h2>Aptitude Round</h2>
//                 <p className="error-message">{error}</p>
//                 <button onClick={() => window.location.reload()}>Retry</button>
//             </div>
//         );
//     }

//     return (
//         <div className="quiz-container">
//             <h1>Round 2</h1>
//             <h2>Aptitude Round</h2>
            
//             {/* Timer display */}
//             <div className="timer-container">
//                 <p>Time Left: {Math.max(timeLeft, 0)} seconds</p>  {/* Display remaining time */}
//             </div>

//             {questions.map((q, index) => (
//                 <div key={index} className="question-card">
//                     <p className="question-text">{q.question}</p>
//                     <div className="options-container">
//                         {q.options.map((option, i) => (
//                             <label key={i} className="option-label">
//                                 <input
//                                     type="radio"
//                                     name={`question-${index}`}  // Unique name for each question to allow independent selection
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
//                 disabled={isSubmitted || Object.keys(answers).length !== questions.length}  // Disable if not all questions answered
//             >
//                 Submit
//             </button>

//             {score !== null && (
//                 <div className="result-container">
//                     <p className="score-text">
//                         You have scored {score.toFixed(1)}%. 
//                         You are {score >= 70 ? "applicable" : "not applicable"} for the next round.
//                     </p>
//                 </div>
//             )}
            
//             {score >= 70 && isSubmitted && (
//                 <button className="proceed-button" onClick={handleProceed}>
//                     Proceed to Technical Round
//                 </button>
//             )}
//         </div>
//     );
// };

// export default AptitudeQuiz;






import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './aptitudequiz.css';

const AptitudeQuiz = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(600);  // 10 minutes timer
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const user_id = searchParams.get('user_id');

    // Fetch questions from the server
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get('http://127.0.0.1:8080/api/aptitude');
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
            [qIndex]: answer  // Associate each question index with the selected answer
        }));
    };

    // Submit answers to the server
    const handleSubmit = async () => {
        if (Object.keys(answers).length !== questions.length) {
            // This logic is removed so that it doesn't show alert if answers are missing
            //alert("Please answer all questions before submitting.");
            setAnswers(answers); // Submit the answers even if some are missing.
        }

        try {
            const res = await axios.post('http://127.0.0.1:8080/api/submit/aptitude', { answers, user_id });
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
        navigate(`/technical?user_id=${userid}`);
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
                <h1>Round 2</h1>
                <h2>Aptitude Round</h2>
                <p>Loading questions...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="quiz-container">
                <h1>Round 2</h1>
                <h2>Aptitude Round</h2>
                <p className="error-message">{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="quiz-container">
            <h1>Round 2</h1>
            <h2>Aptitude Round</h2>
            
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
                                    name={`question-${index}`}  // Unique name for each question to allow independent selection
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
                disabled={isSubmitted || Object.keys(answers).length !== questions.length}  // Disable if not all questions answered
            >
                Submit
            </button>

            {score !== null && (
                <div className="result-container">
                    <p className="score-text">
                        You have scored {score.toFixed(1)}%. 
                        You are {score >= 70 ? "applicable" : "not applicable"} for the next round.
                    </p>
                </div>
            )}
            
            {score >= 70 && isSubmitted && (
                <button className="proceed-button" onClick={handleProceed}>
                    Proceed to Technical Round
                </button>
            )}
        </div>
    );
};

export default AptitudeQuiz;