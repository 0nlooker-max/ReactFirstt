import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./style.css";
import Timer from './Timer';

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
    <div className="container text-center mt-5">
      <div className="input-box mb-4 d-flex justify-content-center p-3">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="form-control me-2 custom-input"
          placeholder="0"
        />
        <button onClick={addTimer} className="btn btn-primary">
          Add Timer
        </button>
      </div>

      <div className="d-flex flex-wrap justify-content-center gap-4">
        {timers.map((timer) => (
          <Timer key={timer.id} initialTime={timer.time} onRemove={() => removeTimer(timer.id)} />
        ))}
      </div>
    </div>
  );
}

export default App;