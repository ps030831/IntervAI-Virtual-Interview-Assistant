
// import React, { useEffect, useState } from 'react';

// const Summary = () => {
//     const [isReportReady, setIsReportReady] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Request the report generation from the backend
//         const generateReport = async () => {
//             try {
//                 const results = JSON.parse(sessionStorage.getItem('results')); 
                
//                 if (!results || results.length === 0) {
//                     console.error("Error: No results found in sessionStorage.");
//                     setLoading(false);
//                     return;
//                 }

//                 const response = await fetch('http://127.0.0.1:8080/api/generate_report', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ results, user_id: localStorage.getItem("userid") }) // Pass the user_id to the backend
//                 });
                
//                 const data = await response.json();
                
//                 if (response.ok && data.message === "Report generated successfully") {
//                     setIsReportReady(true);  // Set report ready status
//                 } else {
//                     console.error('Error generating report:', data.error);
//                 }
//             } catch (error) {
//                 console.error('Error generating report:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         generateReport();
//     }, []);

//     // Function to handle report download
//     const downloadReport = () => {
//         const userId = localStorage.getItem("userid");
//         const filePath = sessionStorage.getItem('filePath');

//         if (!userId || !filePath) {
//             alert("No report available.");
//             return;
//         }

//         // Open a new tab to download the report
//         window.open(`http://127.0.0.1:8080/api/download_report?user_id=${userId}`, "_blank");
//     };

//     return (
//         <div className="summary-container" style={{ textAlign: 'center', marginTop: '50px' }}>
//             <h1>Congratulations!</h1>
//             <p>The interview is over. Thank you for completing all rounds.</p>
//             <p>You can download your assessment report using the link below:</p>

//             {loading ? (
//                 <p>Generating your report, please wait...</p>
//             ) : isReportReady ? (
//                 <button
//                     onClick={downloadReport}
//                     style={{ fontSize: '18px', color: '#2b8a3e', padding: '10px 20px', cursor: 'pointer' }}
//                 >
//                     Download Your PDF Report
//                 </button>
//             ) : (
//                 <p style={{ color: 'red' }}>Error: PDF report generation failed.</p>
//             )}
//         </div>
//     );
// };

// export default Summary;













import React, { useEffect, useState } from 'react';

const Summary = () => {
    const [isReportReady, setIsReportReady] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const generateReport = async () => {
            try {
                const results = JSON.parse(sessionStorage.getItem('results')); 
                
                if (!results || results.length === 0) {
                    console.error("Error: No results found in sessionStorage.");
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://127.0.0.1:8080/api/generate_report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ results, user_id: localStorage.getItem("userid") })
                });
                
                const data = await response.json();
                
                if (response.ok && data.message === "Report generated successfully") {
                    setIsReportReady(true);
                } else {
                    console.error('Error generating report:', data.error);
                }
            } catch (error) {
                console.error('Error generating report:', error);
            } finally {
                setLoading(false);
            }
        };

        generateReport();
    }, []);

    const downloadReport = () => {
        const userId = localStorage.getItem("userid");
        const filePath = sessionStorage.getItem('filePath');

        if (!userId || !filePath) {
            alert("No report available.");
            return;
        }

        window.open('http://127.0.0.1:8080/api/download_report?user_id=${userId}', "_blank");
    };

    return (
        <div style={{
            height: '100vh', // Full viewport height
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            padding: 0,
            background: 'linear-gradient(to bottom, #4C3B5C, #2A1F3D)', // Full-page gradient background
            color: 'white',
            textAlign: 'center'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '2em', color: 'white', marginBottom: '20px' }}>Congratulations!</h1>
                <p>The interview is over. Thank you for completing all rounds.</p>
                <p>You can download your assessment report using the link below:</p>

                {loading ? (
                    <p>Generating your report, please wait...</p>
                ) : isReportReady ? (
                    <button
                        onClick={downloadReport}
                        style={{
                            padding: '14px 28px',
                            margin: '18px auto',
                            fontSize: '18px',
                            color: '#121212',
                            backgroundColor: '#4C3B5C',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.4)',
                            fontFamily: 'Poppins, sans-serif',
                            textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                            display: 'block',
                            width: 'fit-content'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#E6A8A1';
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0px 8px 16px rgba(0, 0, 0, 0.5)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#4C3B5C';
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.4)';
                        }}
                    >
                        Download Your PDF Report
                    </button>
                ) : (
                    <p style={{ color: 'red' }}>Error: PDF report generation failed.</p>
                )}
            </div>
        </div>
    );
};

export default Summary;