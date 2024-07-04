import { Routes, Route } from 'react-router-dom';

import Navbar from './components/NavBar'; // Adjust the import path as necessary
import Home from './pages/Home'; // Adjust the import path as necessary
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  return (
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
  );
};

export default App;
