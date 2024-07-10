import { Routes, Route, Outlet } from 'react-router-dom';

import NavBar from './components/NavBar';
import UserNavBar from './components/UserNavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Todos from './pages/Todos';
import Albums from './pages/Albums';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<NavBar />} >
          <Route path="/home" element={<Home />} />

          <Route element={<UserNavBar />} >
            <Route path="/users/:id">
              <Route path="todos" element={<Todos />} />
              <Route path="albums" element={<Albums />} />
              <Route path="*" element={<div>User Details</div>} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Login />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </div>
  );
};

export default App;
