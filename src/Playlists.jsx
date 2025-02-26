import './App.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"

export function Playlists() {
  const [playLists, setPlaylists] = useState([])
  const [errorLabel, setErrorLabel] = useState("")

  const navigate = useNavigate();
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  async function loadPlaylists() {
    setErrorLabel("");
    setPlaylists([]);

    return fetch("api/playlist", {})
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
        setPlaylists(data);
      })
      .catch(error => {
        console.error(error);
        setErrorLabel("Playlists loading fails");
      });
  }

  function handleEdit(playList) {
    navigate('/edit/' + playList.name);
  }

  useEffect(() => {
    loadPlaylists();
  }, []);

  if (playLists.length == 0) {
    return (
      <>
        <h1> No playlists available</h1>
      </>
    )
  }

  return (
    <>
      <h1> Your playlists </h1>

      <label>{errorLabel}</label>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Private</th>
            <th>CreatedBy</th>
            <th>Action</th>
          </tr>
          {playLists.map((p) => {
            return (
              <tr key={p.name}>
                <td>{p.name}</td>
                <td>{p.isPrivate ? "private" : "public"}</td>
                <td>{p.creatorUserName}</td>
                <td><button onClick={() => handleEdit(p)}>EDIT</button></td>
              </tr>
            )
          })
          }
        </tbody>
      </table>

      <br></br>
      <br></br>
      <a href='/new'>Add new playlist</a>

    </>
  )
}
