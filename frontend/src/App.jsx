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
import { Provider } from "react-redux";
import appStore from "./utils/appStore.js";
import NotFound from "./components/NotFound.jsx";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            {/*  Public Route (No Navbar) */}
            <Route path="/login" element={<Login />} />

            {/*  Protected Routes (With Navbar) */}
            <Route path="/" element={<Body />}>
              <Route index element={<Note />} />
              <Route path="/create" element={<CreateNote />} />
              <Route path="/edit/:id" element={<EditNote />} />
            </Route>

            {/* Unknown URL */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
