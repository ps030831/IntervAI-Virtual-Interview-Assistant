import React, { useEffect, useState } from 'react';

const Timer = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);  // Cleanup on unmount
    }
  }, [timeLeft]);

  return (
    <div>
      <h2>Time Left: {timeLeft} seconds</h2>
    </div>
  );
};

export default Timer;
