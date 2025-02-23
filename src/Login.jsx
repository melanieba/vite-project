import './App.css'
import { useNavigate } from 'react-router-dom';
import { useState } from "react"


export function Login() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const navigate = useNavigate();

  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [errorLabel, setErrorLabel] = useState("")

  async function handleLogin(e) {
    e.preventDefault()
    const options = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        username: userName,
        password: password,
      }),
    };
    fetch("/api/login", options)
      .then(response => {
        if (!response.ok) {
          return Promise.reject({ status: response.status, fullError: response.json() })
        }
        return response.json();
      })
      .then((data) => {
        navigate('/');
      })
      .catch(error => {
        console.error(error);
        setErrorLabel("Invalid username or password");
      });
  }

  return (
    <>
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        <div>
          <div>
            <label htmlFor="userName">User name:</label>
            <input onChange={e => { setUserName(e.target.value) }} type="userName" id="userName" />
          </div>
          <div>
            <label htmlFor="password">Password :</label>
            <input onChange={e => { setPassword(e.target.value) }} type="password" id="password" />
          </div>
          <button type="submit">LOG IN</button>
          <br />
          <label>{errorLabel}</label>
        </div>
      </form>
    </>
  )
}
