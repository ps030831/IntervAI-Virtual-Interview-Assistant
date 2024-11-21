

// import { useNavigate, useSearchParams } from 'react-router-dom';
// import './round1page.css';
// import React, { useState, useEffect } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// function Round1Page({ candidateName = 'Candidate', candidateField = 'Data Science' }) {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const user_id = searchParams.get('user_id');
  
//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//   } = useSpeechRecognition();

//   const [timeLeft, setTimeLeft] = useState(60);
//   const [isFinished, setIsFinished] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     let timer;
//     if (listening && timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//     } else if (timeLeft === 0 && !isFinished) {
//       stopRecording();
//     }
//     return () => clearInterval(timer);
//   }, [listening, timeLeft]);

//   const startRecording = () => {
//     if (!listening) {
//       SpeechRecognition.startListening({continuous:true}); // Start speech recognition
//     }
//   };

//   const stopRecording = async () => {
//     SpeechRecognition.stopListening(); // Stop speech recognition
//     setIsFinished(true);

//     // Check if transcription is empty and log the result
//     if (transcript.trim() === '') {
//       setErrorMessage('No transcription available.');
//       return;
//     }

//     // Log transcription to ensure it's correctly recorded
//     console.log('Transcription:', transcript);
//     console.log('userid', user_id);

//     try {
//       // Sending the transcription to the backend via fetch
//       const response = await fetch('http://localhost:8080/process-speech', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({
//           transcription: transcript,
//           user_id: user_id,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setErrorMessage('');
//         alert('Transcription saved!');
//       } else {
//         const errorData = await response.json();
//         setErrorMessage(errorData.message || 'Failed to process speech');
//       }
//     } catch (error) {
//       console.error('Error processing speech:', error);
//       setErrorMessage('Failed to process speech. Please check your network connection or try again later.');
//     }
//   };


//   const goToNextRound = () => {
//     const userid= localStorage.getItem("userid")
//     navigate(`/aptitude?user_id=${userid}`);
// };

//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }

//   return (
//     <div className="round1-container">
//       <h1>Round 1: Personal Introduction</h1>
//       <p>Hello {candidateName}! Please introduce yourself for a minute.</p>

//       <button onClick={startRecording} disabled={listening}>
//         {listening ? 'Recording...' : 'Start Recording'}
//       </button>

//       {listening && (
//         <div className="timer-container">
//           <p>Time left: {timeLeft} seconds</p>
//           <p>Transcription: {transcript}</p>
//         </div>
//       )}

//       {isFinished && (
//         <div>
//           <p>Transcription saved!</p>
//           <button onClick={goToNextRound}>Proceed to Round 2</button>
//         </div>
//       )}

//       {errorMessage && <p className="error-message">{errorMessage}</p>}
//     </div>
//   );
// }

// export default Round1Page;




import { useNavigate, useSearchParams } from 'react-router-dom';
import './round1page.css';
import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function Round1Page({ candidateName = 'Candidate', candidateField = 'Data Science' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const user_id = searchParams.get('user_id');
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let timer;
    if (listening && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isFinished) {
      stopRecording();
    }
    return () => clearInterval(timer);
  }, [listening, timeLeft]);

  const startRecording = () => {
    if (!listening) {
      SpeechRecognition.startListening({continuous:true}); // Start speech recognition
    }
  };

  const stopRecording = async () => {
    SpeechRecognition.stopListening(); // Stop speech recognition
    setIsFinished(true);

    // Check if transcription is empty and log the result
    if (transcript.trim() === '') {
      setErrorMessage('No transcription available.');
      return;
    }

    // Log transcription to ensure it's correctly recorded
    console.log('Transcription:', transcript);
    console.log('userid', user_id);

    try {
      // Sending the transcription to the backend via fetch
      const response = await fetch('http://localhost:8080/process-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          transcription: transcript,
          user_id: user_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setErrorMessage('');
        alert('Transcription saved!');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to process speech');
      }
    } catch (error) {
      console.error('Error processing speech:', error);
      setErrorMessage('Failed to process speech. Please check your network connection or try again later.');
    }
  };


  const goToNextRound = () => {
    const userid = localStorage.getItem("userid")
    navigate(`/aptitude?user_id=${userid}`);
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <div className="top-bar">
        <span>IntervAI: Your Virtual Interview Assistant</span>
    </div>
    <div className="round1-container">
      <h1>Round 1: Personal Introduction</h1>
      <p>Hello {candidateName}! Please introduce yourself for a minute.</p>

      <button onClick={startRecording} disabled={listening || isFinished}>
        {listening ? 'Recording...' : 'Start Recording'}
      </button>

      {/* New Stop Recording button that appears only when listening */}
      {listening && (
        <button onClick={stopRecording} style={{ marginLeft: '10px' }}>
          Stop Recording
        </button>
      )}

      {listening && (
        <div className="timer-container">
          <p>Time left: {timeLeft} seconds</p>
          <p>Transcription: {transcript}</p>
        </div>
      )}

      {isFinished && (
        <div>
          <p>Transcription saved!</p>
          <button onClick={goToNextRound}>Proceed to Round 2</button>
        </div>
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
    </div>
  );
}

export default Round1Page;