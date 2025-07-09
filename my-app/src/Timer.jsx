import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "./style.css";

function App() {


  return (
    <Container className="text-center mt-5">
      <div className="container text-center mt-5">
        {/* Input Box */}
        <div className="input-box mb-4 d-flex justify-content-center p-3 mx-auto">
          <input
            type="number"
            className="form-control me-2 custom-input"
            placeholder="0"
          />
          <button className="btn btn-primary">Add Timer</button>
        </div>

        {/* Timer Cards with Buttons (UI Only) */}
        <div className="row justify-content-center gap-3">
          <div className="col-auto">
            <div className="timer-box">
              <button className="close-btn">×</button>
              <h2>30</h2>
              <div className="timer-btn-group">
                <button className="btn btn-warning">Pause</button>
                <button className="btn btn-info">Reset</button>
              </div>
            </div>
          </div>

          <div className="col-auto">
            <div className="timer-box">
              <button className="close-btn">×</button>
              <h2>45</h2>
              <div className="timer-btn-group">
                <button className="btn btn-warning">Pause</button>
                <button className="btn btn-info">Reset</button>
              </div>
            </div>
          </div>

          <div className="col-auto">
            <div className="timer-box">
              <button className="close-btn">×</button>
              <h2>60</h2>
              <div className="timer-btn-group">
                <button className="btn btn-warning ">Pause</button>
                <button className="btn btn-info">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default App;
