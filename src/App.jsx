import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'; 
import { Playlists } from './Playlists'
import { Login } from './Login'
import { EditPlaylist } from './EditPlaylist'
import { NewPlaylist } from './NewPlaylist'

function App() {

  return (

    <BrowserRouter>

      <div>

        <Link to="/">Playlists</Link>

        <Routes>

          <Route path="/" element={<Playlists />} />

          <Route path="/login" element={<Login />} />

          <Route path="/edit/:playListName" element={<EditPlaylist />} />

          <Route path="/new" element={<NewPlaylist />} />

        </Routes>

      </div>

    </BrowserRouter>

  );

}


export default App
