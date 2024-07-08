import { Routes, Route, Outlet } from 'react-router-dom';

import NavBar from './components/NavBar'; // Adjust the import path as necessary
import Home from './pages/Home'; // Adjust the import path as necessary
import Login from './pages/Login';
import Register from './pages/Register';
import Todos from './pages/Todos';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />

        <Route element={<NavBar />} >
          <Route path="/users/:id">
            <Route path="todos" element={<Todos />} />
            {/* <Route path="posts" element={<Posts />} /> */}
            <Route path="*" element={<div>User Details</div>} />
          </Route>
        </Route>

        <Route path="/" element={<Login />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </div>
  );
};

const Layout = () => (
  <div>
    <NavBar />
    <Outlet />
  </div>
);

export default App;
