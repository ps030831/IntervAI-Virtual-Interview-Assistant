

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
// import './aptitudequiz.css'; // Import the CSS file

// const AptitudeQuiz = () => {
//     const [questions, setQuestions] = useState([]);
//     const [answers, setAnswers] = useState({});
//     const [score, setScore] = useState(null); // State for score
//     const [isSubmitted, setIsSubmitted] = useState(false); // Track if submitted
//     const navigate = useNavigate(); // Initialize navigate

//     useEffect(() => {
//         axios.get('http://127.0.0.1:5000/api/aptitude') // Update the URL to match your backend
//             .then(res => {
//                 console.log(res.data); // Log the response
//                 setQuestions(res.data);
//             })
//             .catch(err => {
//                 console.error(err); // Log any errors
//                 alert('Error fetching questions.'); // Alert user
//             });
//     }, []);

//     const handleAnswerChange = (qIndex, answer) => {
//         setAnswers(prevAnswers => ({
//             ...prevAnswers,
//             [qIndex]: answer
//         }));
//     };

//     const handleSubmit = () => {
//         if (Object.keys(answers).length === 0) {
//             alert("Please select at least one answer before submitting.");
//             return;
//         }

//         axios.post('http://127.0.0.1:5000/api/submit/aptitude', answers)
//             .then(res => {
//                 setScore(res.data.score);
//                 setIsSubmitted(true);
//             })
//             .catch(err => console.error(err));
//     };

//     const handleProceed = () => {
//         alert("Proceeding to the Technical Round...");
//         navigate('/technical'); // Redirect to the Technical Round route
//     };

//     return (
//         <div className="quiz-container">
//             <h1>Welcome to the Interview Bot</h1>
//             <h2>Aptitude Round</h2>
//             {questions.length > 0 ? (
//                 questions.map((q, index) => (
//                     <div key={index} className="question-card">
//                         <p>{q.question}</p>
//                         {q.options.map((option, i) => (
//                             <label key={i}>
//                                 <input
//                                     type="radio"
//                                     name={`question-${index}`}
//                                     value={option}
//                                     onChange={() => handleAnswerChange(index, option)}
//                                     disabled={isSubmitted} // Disable radio buttons if submitted
//                                 />
//                                 {option}
//                             </label>
//                         ))}
//                     </div>
//                 ))
//             ) : (
//                 <p>Loading questions...</p>
//             )}
//             <button className="submit-button" onClick={handleSubmit} disabled={isSubmitted}>Submit</button>
//             {score !== null && (
//                 <p>
//                     You have scored {score}%. You are {score >= 70 ? "applicable" : "not applicable"} for the next round.
//                 </p>
//             )}
//             {score >= 70 && isSubmitted && (
//                 <button className="proceed-button" onClick={handleProceed}>Proceed to Next Round</button>
//             )}
//         </div>
//     );
// };

// export default AptitudeQuiz;




















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './aptitudequiz.css';

// const AptitudeQuiz = () => {
//     const [questions, setQuestions] = useState([]);
//     const [answers, setAnswers] = useState({});
//     const [score, setScore] = useState(null);
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchQuestions = async () => {
//             try {
//                 setIsLoading(true);
//                 const res = await axios.get('http://127.0.0.1:5000/api/aptitude');
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

//     const handleAnswerChange = (qIndex, answer) => {
//         setAnswers(prevAnswers => ({
//             ...prevAnswers,
//             [qIndex]: answer
//         }));
//     };

//     const handleSubmit = async () => {
//         if (Object.keys(answers).length === 0) {
//             alert("Please select at least one answer before submitting.");
//             return;
//         }

//         try {
//             const res = await axios.post('http://127.0.0.1:5000/api/submit/aptitude', answers);
//             setScore(res.data.score);
//             setIsSubmitted(true);
//         } catch (err) {
//             alert('Error submitting answers. Please try again.');
//             console.error(err);
//         }
//     };

//     const handleProceed = () => {
//         navigate('/technical');
//     };

//     if (isLoading) {
//         return (
//             <div className="quiz-container">
//                 <h1>Welcome to the Interview Bot</h1>
//                 <h2>Aptitude Round</h2>
//                 <p>Loading questions...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="quiz-container">
//                 <h1>Welcome to the Interview Bot</h1>
//                 <h2>Aptitude Round</h2>
//                 <p className="error-message">{error}</p>
//                 <button onClick={() => window.location.reload()}>Retry</button>
//             </div>
//         );
//     }

//     return (
//         <div className="quiz-container">
//             <h1>Welcome to the Interview Bot</h1>
//             <h2>Aptitude Round</h2>
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
//                 disabled={isSubmitted || Object.keys(answers).length === 0}
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
// import { useNavigate } from 'react-router-dom';
// import './aptitudequiz.css';

// const AptitudeQuiz = () => {
//     const [questions, setQuestions] = useState([]);
//     const [answers, setAnswers] = useState({});
//     const [score, setScore] = useState(null);
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchQuestions = async () => {
//             try {
//                 setIsLoading(true);
//                 const res = await axios.get('http://127.0.0.1:5000/api/aptitude');
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

//     const handleAnswerChange = (qIndex, answer) => {
//         setAnswers(prevAnswers => ({
//             ...prevAnswers,
//             [qIndex]: answer
//         }));
//     };

//     const handleSubmit = async () => {
//         if (Object.keys(answers).length === 0) {
//             alert("Please select at least one answer before submitting.");
//             return;
//         }

//         try {
//             const res = await axios.post('http://127.0.0.1:5000/api/submit/aptitude', answers);
//             setScore(res.data.score);
//             setIsSubmitted(true);
//         } catch (err) {
//             alert('Error submitting answers. Please try again.');
//             console.error(err);
//         }
//     };

//     const handleProceed = () => {
//         navigate('/technical');
//     };

//     if (isLoading) {
//         return (
//             <div className="quiz-container">
//                 <h1>Welcome to the Interview Bot</h1>
//                 <h2>Aptitude Round</h2>
//                 <p>Loading questions...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="quiz-container">
//                 <h1>Welcome to the Interview Bot</h1>
//                 <h2>Aptitude Round</h2>
//                 <p className="error-message">{error}</p>
//                 <button onClick={() => window.location.reload()}>Retry</button>
//             </div>
//         );
//     }

//     return (
//         <div className="quiz-container">
//             <h1>Welcome to the Interview Bot</h1>
//             <h2>Aptitude Round</h2>
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
//                 disabled={isSubmitted || Object.keys(answers).length === 0}
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
import { useNavigate } from 'react-router-dom';
import './aptitudequiz.css';

const AptitudeQuiz = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch questions from the server
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get('http://127.0.0.1:5000/api/aptitude');
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
            alert("Please answer all questions before submitting.");
            return;
        }

        try {
            const res = await axios.post('http://127.0.0.1:5000/api/submit/aptitude', answers);
            setScore(res.data.score);
            setIsSubmitted(true);
        } catch (err) {
            alert('Error submitting answers. Please try again.');
            console.error(err);
        }
    };

    // Handle the proceed action to the next round
    const handleProceed = () => {
        navigate('/technical');
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="quiz-container">
                <h1>Welcome to the Interview Bot</h1>
                <h2>Aptitude Round</h2>
                <p>Loading questions...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="quiz-container">
                <h1>Welcome to the Interview Bot</h1>
                <h2>Aptitude Round</h2>
                <p className="error-message">{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="quiz-container">
            <h1>Welcome to the Interview Bot</h1>
            <h2>Aptitude Round</h2>
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
