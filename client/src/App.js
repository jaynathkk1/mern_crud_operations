

import { Routes, Route } from 'react-router-dom';
import Headers from './components/Headers/Headers';
import Home from './pages/Home/Home';
import Edit from './pages/Edit/Edit';
import Profile from './pages/Profile/Profile';
import Register from './pages/Register/Register';
import './App.css';

function App() {
  return (
    <>
    <Headers />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/edit/:id' element={<Edit />} />
      <Route path='/register' element={<Register />} />
      <Route path='/userprofile/:id' element={<Profile />} />
    </Routes>
    </>
  );
}

export default App;
