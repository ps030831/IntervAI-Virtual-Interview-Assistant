
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AptitudeQuiz from '/Users/ij/Desktop/PYTHON/capstone/capstone-frontend/src/components/aptitudequiz.js';
// import TechnicalQuiz from '/Users/ij/Desktop/PYTHON/capstone/capstone-frontend/src/components/technicalquiz.js';
// import CodingRound from '/Users/ij/Desktop/PYTHON/capstone/capstone-frontend/src/components/codinground.js'; 

// const App = () => {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<AptitudeQuiz />} />
//                 <Route path="/technical" element={<TechnicalQuiz />} />

//             </Routes>
//         </Router>
//     );
// };

// export default App;





import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AptitudeQuiz from '/Users/ij/Desktop/PYTHON/capstone/capstone-frontend/src/components/aptitudequiz.js';
import TechnicalQuiz from '/Users/ij/Desktop/PYTHON/capstone/capstone-frontend/src/components/technicalquiz.js';
import CodingRound from '/Users/ij/Desktop/PYTHON/capstone/capstone-frontend/src/components/codinground.js'; 

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AptitudeQuiz />} />
                <Route path="/technical" element={<TechnicalQuiz />} />
                <Route path="/coding" element={<CodingRound />} /> {/* Added CodingRound route */}
            </Routes>
        </Router>
    );
};

export default App;
