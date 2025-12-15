import {
  BrowserRouter,
  Route,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import Note from "./components/Note.jsx";

function App() {

  return (
    <>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Note/>}/>
          <Route/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
