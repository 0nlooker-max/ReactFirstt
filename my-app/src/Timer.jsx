import React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "./app.css";
import "./style.css";

// ...rest of your code...

function TimerCard({ timer, onPause, onReset, onRemove }) {
    return (
        <div
            className="timer-card"
            style={{
                border: timer.isRunning ? "4px solid #f00" : "4px solid #09f",
                background: "#111",
                color: "#fff",
                borderRadius: "16px",
                padding: "20px",
                margin: "10px",
                width: "160px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
            }}
        >
            <button
                onClick={onRemove}
                style={{
                    position: "absolute",
                    top: "8px",
                    right: "12px",
                    background: "transparent",
                    color: "#fff",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                }}
                aria-label="Remove"
            >
                ×
            </button>
            <div style={{ fontSize: "40px", margin: "20px 0" }}>{timer.time}</div>
            <div style={{ display: "flex", gap: "10px" }}>
                <button
                    onClick={onPause}
                    style={{
                        background: timer.isRunning ? "#f00" : "#09f",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                >
                    {timer.isRunning ? "pause" : "start"}
                </button>
                <button
                    onClick={onReset}
                    style={{
                        background: "#09f",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

function Timer() {
    const [timers, setTimers] = useState([]);
    const [input, setInput] = useState("");
    const intervals = useRef({});

    // Start or pause a timer
    const toggleTimer = (id) => {
        setTimers((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, isRunning: !t.isRunning } : t
            )
        );
    };

    // Reset a timer
    const resetTimer = (id) => {
        setTimers((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, time: 0, isRunning: false } : t
            )
        );
    };

    // Remove a timer
    const removeTimer = (id) => {
        clearInterval(intervals.current[id]);
        setTimers((prev) => prev.filter((t) => t.id !== id));
    };

    // Add a new timer
    const addTimer = () => {
        if (!input || isNaN(Number(input))) return;
        const id = Date.now();
        setTimers((prev) => [
            ...prev,
            { id, time: Number(input), isRunning: false },
        ]);
        setInput("");
    };

    // Handle timer intervals
    // ...existing code...
    useEffect(() => {
        timers.forEach((timer) => {
            if (timer.isRunning && !intervals.current[timer.id]) {
                intervals.current[timer.id] = setInterval(() => {
                    setTimers((prev) =>
                        prev.map((t) =>
                            t.id === timer.id
                                ? { ...t, time: t.time > 0 ? t.time - 1 : 0, isRunning: t.time > 1 }
                                : t
                        )
                    );
                }, 1000);
            } else if (!timer.isRunning && intervals.current[timer.id]) {
                clearInterval(intervals.current[timer.id]);
                intervals.current[timer.id] = null;
            }
        });
        // Cleanup on unmountF
        return () => {
            Object.values(intervals.current).forEach(clearInterval);
        };
    }, [timers]);
    // ...existing code...

    return (
        <div style={{ background: "#222", minHeight: "100vh", padding: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
                <input
                    type="number"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{
                        width: "300px",
                        height: "40px",
                        fontSize: "20px",
                        marginRight: "10px",
                        borderRadius: "8px",
                        border: "1px solid #09f",
                        padding: "0 10px",
                        background: "#111",
                        color: "#fff",
                    }}
                    placeholder="0"
                />
                <button
                    onClick={addTimer}
                    style={{
                        background: "#09f",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 24px",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                >
                    Add Timer
                </button>
            </div>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "24px",
                }}
            >
                {timers.map((timer) => (
                    <TimerCard
                        key={timer.id}
                        timer={timer}
                        onPause={() => toggleTimer(timer.id)}
                        onReset={() => resetTimer(timer.id)}
                        onRemove={() => removeTimer(timer.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Timer;