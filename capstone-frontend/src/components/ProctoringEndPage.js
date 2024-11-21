// // src/components/ProctoringEndPage.js
// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const ProctoringEndPage = () => {
//     const navigate = useNavigate();

//     // Optional: Redirect to summary page after a few seconds
//     React.useEffect(() => {
//         const timer = setTimeout(() => {
//             navigate("/summary"); // Navigate to summary after 5 seconds
//         }, 5000);

//         return () => clearTimeout(timer); // Clear timeout if component unmounts
//     }, [navigate]);

//     return (
//         <div style={{ textAlign: 'center', marginTop: '50px' }}>
//             <h2>Proctoring Session Ended</h2>
//             <p>Proctoring has ended due to multiple warnings.</p>
//             <p>You will be redirected to the summary page shortly...</p>
//         </div>
//     );
// };

// export default ProctoringEndPage;


// src/components/ProctoringEndPage.js
import React from 'react';

const ProctoringEndPage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Proctoring Session Ended</h2>
            <p>Proctoring has ended due to multiple warnings.</p>
            <p>Please contact support or review your interview session details.</p>
        </div>
    );
};

export default ProctoringEndPage;


