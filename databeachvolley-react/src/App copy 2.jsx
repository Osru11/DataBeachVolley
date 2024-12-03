import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    client
      .get("/api/user/")
      .then(() => {
        setCurrentUser(true);
      })
      .catch(() => {
        setCurrentUser(false);
      });
  }, []);

  const updateFormButton = () => {
    setRegistrationToggle(!registrationToggle);
    const button = document.getElementById("form_btn");
    if (button) {
      button.innerHTML = registrationToggle ? "Register" : "Log in";
    }
  };

  const submitRegistration = (e) => {
    e.preventDefault();
    client
      .post("/api/register/", {
        email: email,
        username: username,
        password: password,
      })
      .then(() => {
        return client.post("/api/login/", { email, password });
      })
      .then(() => {
        setCurrentUser(true);
      });
  };

  const submitLogin = (e) => {
    e.preventDefault();
    client
      .post("/api/login/", { email, password })
      .then(() => {
        setCurrentUser(true);
      });
  };

  const submitLogout = (e) => {
    e.preventDefault();
    client.post("/api/logout/", {}).then(() => {
      setCurrentUser(false);
    });
  };

  if (currentUser) {
    return (
      <div>
        <nav className="navbar navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              Authentication App
            </a>
            <div className="d-flex justify-content-end">
              <form onSubmit={submitLogout}>
                <button type="submit" className="btn btn-light">
                  Log out
                </button>
              </form>
            </div>
          </div>
        </nav>
        <div className="text-center mt-5">
          <h2>You're logged in!</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Authentication App
          </a>
          <div className="d-flex justify-content-end">
            <button id="form_btn" onClick={updateFormButton} className="btn btn-light">
              Register
            </button>
          </div>
        </div>
      </nav>
      {registrationToggle ? (
        <div className="container mt-5">
          <form onSubmit={submitRegistration}>
            <div className="mb-3">
              <label htmlFor="formBasicEmail" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="formBasicEmail"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <small className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className="mb-3">
              <label htmlFor="formBasicUsername" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="formBasicUsername"
                className="form-control"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="formBasicPassword" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="formBasicPassword"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="container mt-5">
          <form onSubmit={submitLogin}>
            <div className="mb-3">
              <label htmlFor="formBasicEmail" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="formBasicEmail"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <small className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className="mb-3">
              <label htmlFor="formBasicPassword" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="formBasicPassword"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
