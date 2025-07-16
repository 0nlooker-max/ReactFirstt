import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import TimerCard from "./components/timercard";
import "./style.css";

function Timer() {
  const [timers, setTimers] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addTimer = () => {
    const time = parseInt(inputValue);
    if (!isNaN(time) && time >= 0) {
      setTimers([...timers, { id: Date.now(), time }]);
      setInputValue("");
    }
  };

  const removeTimer = (id) => {
    setTimers(timers.filter((t) => t.id !== id));
  };

  return (
    <Container className="text-center mt-5">
      <div className="navbox">
        <Nav.Link as={Link} to="/">HOME</Nav.Link>
      </div>

      <div className="input-box mb-4 d-flex justify-content-center p-3 mx-auto">
        <Form.Control
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="me-2 custom-input"
          placeholder="0"
        />
        <Button onClick={addTimer} variant="primary">Add Timer</Button>
      </div>

      <Row className="justify-content-center gap-3">
        {timers.map((timer) => (
          <Col key={timer.id} xs="auto">
            <TimerCard
              initialTime={timer.time}
              onRemove={() => removeTimer(timer.id)}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Timer;
