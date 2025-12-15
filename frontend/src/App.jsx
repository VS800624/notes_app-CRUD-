import {
  BrowserRouter,
  Route,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import Note from "./components/Note.jsx";
import CreateNote from "./components/CreateNote.jsx";
import EditNote from "./components/EditNote.jsx";

function App() {

  return (
    <>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Note/>}/>
        <Route path="/create" element={<CreateNote/>}/>
        <Route path="/edit/:id" element={<EditNote/>}/>
          <Route/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
