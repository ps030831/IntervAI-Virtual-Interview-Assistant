// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '/Users/ij/Desktop/PYTHON/capstone/capstone-frontend/src/components/technicalquiz.css'; // Import your CSS file

// const TechnicalQuiz = () => {
//     const [questions, setQuestions] = useState([]);
//     const [answers, setAnswers] = useState({});
//     const [score, setScore] = useState(null); // State for score
//     const [isSubmitted, setIsSubmitted] = useState(false); // Track if submitted

//     useEffect(() => {
//         // Update the URL to match your backend
//         axios.get('http://127.0.0.1:5000/api/technical') // Change to match your backend port
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
//         // Check if at least one answer is selected
//         if (Object.keys(answers).length === 0) {
//             alert("Please select at least one answer before submitting.");
//             return;
//         }

//         axios.post('http://127.0.0.1:5000/api/submit/technical', answers) // Change to match your backend port
//             .then(res => {
//                 setScore(res.data.score); // Update the score state
//                 setIsSubmitted(true); // Mark the quiz as submitted
//             })
//             .catch(err => console.error(err));
//     };

//     return (
//         <div className="quiz-container">
//             <h1>Technical Round</h1>
//             {questions.length > 0 ? ( // Check if there are questions
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
//                 <p>Loading questions...</p> // Loading message
//             )}
//             <button className="submit-button" onClick={handleSubmit} disabled={isSubmitted}>Submit</button>
            
//             {/* Display score below the submit button */}
//             {score !== null && (
//                 <p>
//                     You have scored {score}%. You are {score >= 80 ? "eligible" : "not eligible"} for the next round.
//                 </p>
//             )}
//         </div>
//     );
// };

// export default TechnicalQuiz;















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '/Users/ij/Desktop/PYTHON/capstone/capstone-frontend/src/components/technicalquiz.css'; // Import your CSS file

// const TechnicalQuiz = () => {
//     const [questions, setQuestions] = useState([]);
//     const [answers, setAnswers] = useState({});
//     const [score, setScore] = useState(null); // State for score
//     const [isSubmitted, setIsSubmitted] = useState(false); // Track if submitted
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Update the URL to match your backend
//         axios.get('http://127.0.0.1:5000/api/technical') // Change to match your backend port
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
//         // Check if at least one answer is selected
//         if (Object.keys(answers).length !== questions.length) {
//             alert("Please answer all questions before submitting.");
//             return;
//         }

//         axios.post('http://127.0.0.1:5000/api/submit/technical', answers) // Change to match your backend port
//             .then(res => {
//                 setScore(res.data.score); // Update the score state
//                 setIsSubmitted(true); // Mark the quiz as submitted
//             })
//             .catch(err => console.error(err));
//     };

//     const handleProceedToCoding = () => {
//         navigate('/coding');
//     };

//     return (
//         <div className="quiz-container">
//             <h1>Technical Round</h1>
//             {questions.length > 0 ? ( // Check if there are questions
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
//                 <p>Loading questions...</p> // Loading message
//             )}
            
//             <button 
//                 className="submit-button" 
//                 onClick={handleSubmit} 
//                 disabled={isSubmitted}
//             >
//                 Submit
//             </button>
            
//             {/* Display score below the submit button */}
//             {score !== null && (
//                 <p>
//                     You have scored {score}%. You are {score >= 80 ? "eligible" : "not eligible"} for the next round.
//                 </p>
//             )}
            
//             {/* Show Proceed button if eligible */}
//             {score >= 80 && isSubmitted && (
//                 <button 
//                     className="proceed-button" 
//                     onClick={handleProceedToCoding}
//                 >
//                     Proceed to Coding Round
//                 </button>
//             )}
//         </div>
//     );
// };

// export default TechnicalQuiz;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './technicalquiz.css';

const TechnicalQuiz = () => {
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
                const res = await axios.get('http://127.0.0.1:5000/api/technical');
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
            [qIndex]: answer
        }));
    };

    // Submit answers to the server
    const handleSubmit = async () => {
        if (Object.keys(answers).length !== questions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }

        try {
            const res = await axios.post('http://127.0.0.1:5000/api/submit/technical', answers);
            setScore(res.data.score);
            setIsSubmitted(true);
        } catch (err) {
            alert('Error submitting answers. Please try again.');
            console.error(err);
        }
    };

    // Handle the proceed action to the next round
    const handleProceed = () => {
        navigate('/coding');
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="quiz-container">
                <h1>Technical Round</h1>
                <p>Loading questions...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="quiz-container">
                <h1>Technical Round</h1>
                <p className="error-message">{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="quiz-container">
            <h1>Technical Round</h1>
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
