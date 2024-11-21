import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import './intropage.css';

function IntroPage() {
    const [name, setName] = useState('');
    const [field, setField] = useState('');
    const [showCamera, setShowCamera] = useState(false);
    const [imageCaptured, setImageCaptured] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    const handleNameSubmit = () => {
        if (name.trim() === '' || field.trim() === '') {
            setErrorMessage('Please enter both your name and field.');
        } else {
            setErrorMessage('');
            setShowCamera(true);
        }
    };

    const captureImage = async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();

            if (!imageSrc) {
                setErrorMessage('Failed to capture image');
                return;
            }

            console.log('Captured Image Source:', imageSrc); // Log the captured image

            try {
                const response = await fetch('http://127.0.0.1:8080/upload-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, field, image: imageSrc }),
                });

                const data=await response.json();

                console.log('Response Status:', response.status); // Log response status
                console.log('Response Headers:', response.headers); // Log response headers
                console.log('Resonpse', data)



                if (response.ok) {
                    setErrorMessage('');
                    setImageCaptured(true);
                    localStorage.setItem("userid", data.id)

                } else {
                    const errorData = await response.json();

                    setErrorMessage(errorData.message || 'Failed to save image');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                setErrorMessage('Failed to save image');
            }
        } else {
            setErrorMessage('Webcam is not available');
        }
    };

    const startRound1 = () => {
        const userid= localStorage.getItem("userid")
        navigate(`/round1?user_id=${userid}`);
    };

    // return (
        
    //     <div className="intro-container">
    //         <h1>IntervAI: Your Virtual Interview Assistant</h1>
    //         <input
    //             type="text"
    //             value={name}
    //             onChange={(e) => setName(e.target.value)}
    //             placeholder="Enter your name"
    //         />
    //         <input
    //             type="text"
    //             value={field}
    //             onChange={(e) => setField(e.target.value)}
    //             placeholder="Enter your field"
    //         />
    //         <button onClick={handleNameSubmit}>Enter</button>

    //         {errorMessage && <p className="error-message">{errorMessage}</p>}

    //         {showCamera && (
    //             <div className="webcam-container">
    //                 <Webcam
    //                     audio={false}
    //                     ref={webcamRef}
    //                     screenshotFormat="image/jpeg"
    //                     className="webcam"
    //                 />
    //                 <button onClick={captureImage}>Capture Image</button>
    //             </div>
    //         )}

    //         {imageCaptured && (
    //             <div>
    //                 <p className="success-message">Image Captured</p>
    //                 <button onClick={startRound1}>Start Round 1</button>
    //             </div>
    //         )}
    //     </div>
    // );




    return (
        <>
            <div className="top-bar">IntervAI: Your Virtual Interview Assistant</div> {/* Top bar with title */}
            <div className="intro-container">
                <h1>Let's get started</h1>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                />
                <input
                    type="text"
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    placeholder="Enter your field"
                />
                <button onClick={handleNameSubmit}>Enter</button>
    
                {errorMessage && <p className="error-message">{errorMessage}</p>}
    
                {showCamera && (
                    <div className="webcam-container">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="webcam"
                        />
                        <button onClick={captureImage}>Capture Image</button>
                    </div>
                )}
    
                {imageCaptured && (
                    <div>
                        <p className="success-message">Image Captured</p>
                        <button onClick={startRound1}>Start Round 1</button>
                    </div>
                )}
            </div>
        </>
    );
}

export default IntroPage;