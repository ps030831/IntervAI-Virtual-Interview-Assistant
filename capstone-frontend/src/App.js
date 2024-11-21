
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





// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AptitudeQuiz from '/Users/ij/Desktop/PYTHON/capstone/capstone-frontend/src/components/aptitudequiz.js';
// import TechnicalQuiz from '/Users/ij/Desktop/PYTHON/capstone/capstone-frontend/src/components/technicalquiz.js';
// import CodingRound from '/Users/ij/Desktop/PYTHON/capstone/capstone-frontend/src/components/codinground.js'; 
// import Summary from './components/Summary';  // Create this component

// const App = () => {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<AptitudeQuiz />} />
//                 <Route path="/technical" element={<TechnicalQuiz />} />
//                 <Route path="/coding" element={<CodingRound />} /> {/* Added CodingRound route */}
//                 <Route path="/summary" element={<Summary />} />  {/* Summary route */}
//             </Routes>
//         </Router>
//     );
// };

// export default App;







// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // Import all components
// import IntroPage from './components/intropage';
// import Round1Page from './components/round1page';
// import AptitudeQuiz from './components/aptitudequiz';
// import TechnicalQuiz from './components/technicalquiz';
// import CodingRound from './components/codinground';
// import Summary from './components/Summary';

// const App = () => {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<IntroPage />} />               {/* Start from IntroPage */}
//                 <Route path="/round1" element={<Round1Page />} />        {/* Round 1: Personal Introduction */}
//                 <Route path="/aptitude" element={<AptitudeQuiz />} /> {/* Aptitude Quiz with dynamic user_id */}
//                 <Route path="/technical" element={<TechnicalQuiz />} />  {/* Technical Quiz */}
//                 <Route path="/coding" element={<CodingRound />} />       {/* Coding Round */}
//                 <Route path="/summary" element={<Summary />} />          {/* Summary Page */}
//             </Routes>
//         </Router>
//     );
// };

// export default App;









import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all components
import IntroPage from './components/intropage';
import Round1Page from './components/round1page';
import AptitudeQuiz from './components/aptitudequiz';
import TechnicalQuiz from './components/technicalquiz';
import CodingRound from './components/codinground';
import Summary from './components/Summary';
import ProctoringEndPage from './components/ProctoringEndPage';  // Import the new ProctoringEndPage
import ProctoringChecker from './ProctoringChecker';


const App = () => {
    return (
        <Router>
            <ProctoringChecker /> {/* This will check the proctoring status in the background */}
            <Routes>
                <Route path="/" element={<IntroPage />} />               {/* Start from IntroPage */}
                <Route path="/round1" element={<Round1Page />} />        {/* Round 1: Personal Introduction */}
                <Route path="/aptitude" element={<AptitudeQuiz />} />    {/* Aptitude Quiz */}
                <Route path="/technical" element={<TechnicalQuiz />} />  {/* Technical Quiz */}
                <Route path="/coding" element={<CodingRound />} />       {/* Coding Round */}
                <Route path="/summary" element={<Summary />} />          {/* Summary Page */}
                <Route path="/proctoring-end" element={<ProctoringEndPage />} /> {/* New Route for ProctoringEndPage */}
            </Routes>
        </Router>
    );
};

export default App;




