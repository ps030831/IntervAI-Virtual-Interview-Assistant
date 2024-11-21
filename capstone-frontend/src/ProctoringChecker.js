

// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ProctoringChecker = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Function to check proctoring status
//         const checkProctoringStatus = async () => {
//             try {
//                 const response = await fetch('http://localhost:8080/check_proctoring_status');
//                 const data = await response.json();
//                 if (!data.proctoring_active) {
//                     alert("Proctoring has ended due to multiple warnings.");
//                     navigate("/proctoring-end");  // Redirect to the summary or end session page
//                     clearInterval(intervalId);  // Stop further polling
//                 }
//             } catch (error) {
//                 console.error("Error checking proctoring status:", error);
//             }
//         };

//         // Poll the proctoring status every 5 seconds
//         const intervalId = setInterval(checkProctoringStatus, 5000);

//         // Clear interval on component unmount
//         return () => clearInterval(intervalId);
//     }, [navigate]);

//     return null; // This component doesn't render anything visible
// };

// export default ProctoringChecker;



import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProctoringChecker = () => {
    const navigate = useNavigate();
    const [lastWarning, setLastWarning] = useState(""); // Track the last displayed warning

    useEffect(() => {
        const checkProctoringStatus = async () => {
            try {
                const response = await fetch('http://localhost:8080/check_proctoring_status');
                const data = await response.json();

                // Show alert if there's a new warning message that hasn't been displayed yet
                if (data.last_warning && data.last_warning !== lastWarning) {
                    alert(data.last_warning);
                    setLastWarning(data.last_warning); // Update the last displayed warning
                }

                // Redirect to proctoring end page if proctoring has ended
                if (!data.proctoring_active) {
                    navigate("/proctoring-end");
                    clearInterval(intervalId); // Stop further polling when proctoring ends
                }
            } catch (error) {
                console.error("Error checking proctoring status:", error);
            }
        };

        // Poll the proctoring status every 5 seconds
        const intervalId = setInterval(checkProctoringStatus, 5000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [navigate, lastWarning]);

    return null; // This component doesn't render anything visible
};

export default ProctoringChecker;