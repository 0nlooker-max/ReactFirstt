import PropTypes from 'prop-types';
import "../style.css";

function TimerCard({ timeLeft, isPaused, onPause, onReset, onRemove }) {
  return (
    <div className={`timer-box ${timeLeft === 0 ? 'timer-red' : ''}`}>
      <button className="close-btn" onClick={onRemove}>×</button>

      <h2>{timeLeft}</h2>

      <div className="timer-btn-group">
        <button className="btn btn-warning" onClick={onPause}>
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button className="btn btn-info" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

TimerCard.propTypes = {
  timeLeft: PropTypes.number.isRequired,
  isPaused: PropTypes.bool.isRequired,
  onPause: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default TimerCard;
