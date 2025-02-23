import './App.css'
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"

export function EditPlaylist() {
  const { playListName } = useParams()

  const [playList, setPlaylist] = useState(null)
  const [errorLabel, setErrorLabel] = useState("")
  const [saveResultLabel, setSaveResultLabel] = useState("")


  const navigate = useNavigate();
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  async function loadPlaylist() {
    setErrorLabel("");
    setPlaylist({});

    return fetch("/api/playlist/" + playListName, {})
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
        setPlaylist(data);
      })
      .catch(error => {
        console.error(error);
        setErrorLabel("Playlist loading fails");
      });
  }

  const handleIsPrivateChange = (event) => {
    setSaveResultLabel("");

    const options = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify({
        playlistName: playList.name,
        isPrivate: event.target.checked,
      }),
    };

    fetch("/api/playlist/flag", options)
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
        loadPlaylist();
        setSaveResultLabel("Playlist updated");
      })
      .catch(error => {
        console.log(error);
        setSaveResultLabel("Playlist update fails");
      });
  };


  useEffect(() => {
    loadPlaylist();
  }, []);

  if (!playList) {
    return (
      <>
      </>
    )
  }

  return (
    <>
      <h1> Playlist </h1>

      <label>{errorLabel}</label>

      <form>
        <label>Playlist name: </label>
        <label>{playList.name}</label>
        <br></br>
        <label>Private: </label>
        <input type="checkbox" checked={playList.isPrivate || false} onChange={handleIsPrivateChange}></input>
        <br></br>
        <label>{saveResultLabel}</label>
      </form>

    </>
  )
}
