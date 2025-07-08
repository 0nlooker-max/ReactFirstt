import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./app.css";
import "./style.css";

function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  function handleInc() {
    setCount(count + 1);
  }

  function handleInputChange(e) {
    setCount(Number(e.target.value) || 0);
  }

  const handleDec = () => {
    setCount(count - 1);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">ReactFirst</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/timer">Timer</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="image-container">
        <img src="./src/images/Full_image_of_Tung_Tung_Tung_Sahur-removebg-preview.png" alt="Profile" />
      </div>
      <form>
        <h5>Your name: {name}</h5>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          style={{
            display: count > 10 ? "none" : "block",
            marginBottom: "20px",
            padding: "10px",
            fontSize: "16px",
          }}
          placeholder="Enter your name"
        />
      </form>
      <h1
        className="counting"
        style={{
          color: count > 10 ? "blue" : count < 0 ? "yellow" : "white",
          backgroundColor: "black",
          fontSize: "50px",
          textAlign: "center",
        }}
      >
        Count: {count}
      </h1>
      <div className="button-container">
        <button onClick={handleDec} className="dec-button">Decrease</button>
        <button onClick={handleInc} className="inc-button">Increase</button>
      </div>
      <input
        type="number"
        value={count}
        onChange={handleInputChange}
        className="count-input"
        style={{
          width: "100px",
          height: "50px",
          fontSize: "24px",
          textAlign: "center",
          marginTop: "20px",
        }}
      />
      <button onClick={() => navigate("/timer")}>Go to Timer</button>
    </>
  );
}

export default App;