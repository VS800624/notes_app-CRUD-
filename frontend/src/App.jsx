import {
  BrowserRouter,
  Route,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import Note from "./components/Note.jsx";
import CreateNote from "./components/CreateNote.jsx";

function App() {

  return (
    <>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Note/>}/>
        <Route path="/create" element={<CreateNote/>}/>
          <Route/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
