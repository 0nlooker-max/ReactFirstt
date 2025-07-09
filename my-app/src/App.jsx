import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "./style.css";

function App() {
  const [timers, setTimers] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTimer = () => {
    const time = parseInt(inputValue);
    if (!isNaN(time) && time >= 0) {
      setTimers([...timers, { id: Date.now(), time }]);
      setInputValue('');
    }
  };

  const removeTimer = (id) => {
    setTimers(timers.filter((t) => t.id !== id));
  };

  return (
    <Container className="text-center mt-5">
      {/* Input Section */}
      <div className="input-box mb-4 d-flex justify-content-center p-3 mx-auto">
        <Form.Control
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="me-2 custom-input"
          placeholder="0"
        />
        <Button onClick={addTimer} variant="primary">
          Add Timer
        </Button>
      </div>

      {/* Timer Cards */}
      <Row className="justify-content-center gap-3">
        {timers.map((timer) => (
          <Col key={timer.id} xs="auto">
            <TimerCard initialTime={timer.time} onRemove={() => removeTimer(timer.id)} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

function TimerCard({ initialTime, onRemove }) {
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
      <div className="timer-btn-group">
        <button className="btn btn-warning" onClick={pauseTimer}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button className="btn btn-info" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
