import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types"; 
import "../style.css";

function TimerCard({ initialTime, onRemove }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused, timeLeft]);

  const pauseTimer = () => setIsPaused(prev => !prev);

  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsPaused(false);
  };

  return (
    <div className={`timer-box ${timeLeft === 0 ? 'timer-red' : ''}`}>
      <button className="close-btn" onClick={onRemove}>×</button>
      <h2>{timeLeft}</h2>
      <div className="timer-btn-group">
        <button className="btn btn-warning" onClick={pauseTimer}>
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button className="btn btn-info" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default TimerCard;

TimerCard.propTypes = {
  initialTime: PropTypes.number.isRequired, // must be a number
  onRemove: PropTypes.func.isRequired       // must be a function
};
