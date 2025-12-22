import {
  BrowserRouter,
  Route,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import Note from "./components/Note.jsx";
import CreateNote from "./components/CreateNote.jsx";
import EditNote from "./components/EditNote.jsx";
import Login from "./components/login.jsx";
import Body from "./components/Body.jsx";

function App() {

  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          {/*  Public Route (No Navbar) */}
          <Route path="/login" element={<Login />} />

          {/*  Protected Routes (With Navbar) */}
          <Route path="/" element={<Body />}>
            <Route index element={<Note />} />
            <Route path="create" element={<CreateNote />} />
            <Route path="edit/:id" element={<EditNote />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
