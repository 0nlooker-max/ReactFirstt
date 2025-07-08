import React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "./app.css";
import "./style.css";


function Timer({ initialTime, onRemove }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPaused, timeLeft]);

  const pauseTimer = () => {
    setIsPaused((prev) => !prev);
  };

  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsPaused(false);
  };

  return (
    <div className={`timer-box ${timeLeft === 0 ? 'timer-red' : ''}`}>
      <button className="close-btn" onClick={onRemove}>×</button>
      <h2>{timeLeft}</h2>
      <button className="btn btn-warning me-2" onClick={pauseTimer}>
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button className="btn btn-info" onClick={resetTimer}>
        Reset
      </button>
    </div>
  );
}

export default Timer;
