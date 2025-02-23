import './App.css'
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"

export function NewPlaylist() {
  const [playListName, setPlayListName] = useState("")
  const [isPrivate, setIsPrivate] = useState("")
  const [errorLabel, setErrorLabel] = useState("")

  const navigate = useNavigate();
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  async function handleSave(e) {
    e.preventDefault()
    const url = "/api/playlist";
    const options = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        name: playListName,
        isPrivate: isPrivate?"true":"false",
      }),
    };
    fetch(url, options)
      .then(response => {
        if (response.status == 401) {
          navigate("/login");
        }
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
        setErrorLabel("Error with storing new playlist. Check your input");
      });
  }

  return (
    <>
      <form onSubmit={handleSave}>
        <h1>New Playlist</h1>
        <div>
          <div>
            <label htmlFor="playListName">Playlist name:</label>
            <input onChange={e => { setPlayListName(e.target.value) }} type="playListName" id="playListName" />
          </div>
          <div>
            <label htmlFor="isPrivate">Private:</label>
            <input type="checkbox" onChange={e => { setIsPrivate(e.target.value == 'on') }}></input>
          </div>
          <button type="submit">Save new play list</button>
          <br />
          <label>{errorLabel}</label>
        </div>
      </form>

    </>
  )
}
