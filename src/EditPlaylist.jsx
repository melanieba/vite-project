import './App.css'
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"

export function EditPlaylist() {
  const { playListName } = useParams()

  const [playList, setPlaylist] = useState(null)
  const [albums, setAlbums] = useState([])
  const [errorLabel, setErrorLabel] = useState("")
  const [saveResultLabel, setSaveResultLabel] = useState("")


  const navigate = useNavigate();
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  async function loadPlaylist() {
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

  async function loadAlbums() {
    setAlbums([]);

    return fetch("/publicapi/album/list", {})
      .then(response => {
        if (!response.ok) {
          return Promise.reject({ status: response.status, fullError: response.json() })
        }
        return response.json();
      })
      .then((data) => {
        setAlbums(data);
      })
      .catch(error => {
        console.error(error);
        setErrorLabel("Albums loading fails");
      });
  }

  function handleDelete(e, track) {
    e.preventDefault();
    console.log(playList);
    console.log(track);

    setSaveResultLabel("");

    const options = {
      method: "DELETE",
      headers: myHeaders,
      body: JSON.stringify({
        playlistName: playList.name,
        trackName: track.name,
        artistName: track.artist
      }),
    };

    fetch("/api/playlist/track", options)
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
        setSaveResultLabel("Track deleted");
      })
      .catch(error => {
        console.log(error);
        setSaveResultLabel("Track delete fails");
      });

  }

  function handleAdd(e, album, track) {
    e.preventDefault();
    console.log(album);
    console.log(track);

    setSaveResultLabel("");

    const options = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        playlistName: playList.name,
        trackName: track.title,
        artistName: track.primaryArtist
      }),
    };

    fetch("/api/playlist/track", options)
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
        setSaveResultLabel("Track added");
      })
      .catch(error => {
        console.log(error);
        setSaveResultLabel("Track insert fails");
      });
  }

  useEffect(() => {
    setErrorLabel("");
    loadPlaylist();
    loadAlbums();
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

        <table>
          <tbody>
            <tr>
              <td>
                <h1> Tracks </h1>
                {playList.tracks && playList.tracks.length > 0 ?
                  <table>
                    <tbody>
                      <tr>
                        <th>Name</th>
                        <th>Artist</th>
                      </tr>
                      {playList.tracks.map((t) => {
                        return (
                          <tr key={t.name + t.artist}>
                            <td>{t.name}</td>
                            <td>{t.artist}</td>
                            <td><button onClick={(e) => handleDelete(e, t)}>Delete</button></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  : (<label>No tracks</label>)
                }

              </td>
              <td>

                <h1> Albums </h1>
                <table>
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <th>Released</th>
                      <th>Genre</th>
                      <th>Tracks</th>
                    </tr>
                    {albums.map((a) => {
                      return (
                        <tr key={a.name}>
                          <td>{a.name}</td>
                          <td>{a.yearReleased}</td>
                          <td>{a.genre}</td>
                          <td>
                            {a.tracks && a.tracks.length > 0 ?
                              <table>
                                <tbody>
                                  <tr>
                                    <th>Name</th>
                                    <th>Artist</th>
                                  </tr>
                                  {a.tracks.map((t) => {
                                    return (
                                      <tr key={t.title + t.primaryArtist}>
                                        <td>{t.title}</td>
                                        <td>{t.primaryArtist}</td>
                                        <td><button onClick={(e) => handleAdd(e, a, t)}>Add to the playlist</button></td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                              : (<label>No tracks</label>)
                            }
                          </td>
                        </tr>
                      )
                    })
                    }
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>


      </form>

    </>
  )
}
