import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register'; // Assure-toi que ce chemin est correct
import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import './pages/Register.css';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header>
          </div>
        } />
        <Route path="/register" element={<Register />} />
        {/* Tu pourras ajouter d'autres routes ici, comme /login, /dashboard */}
        {/* ... dans les Routes */}
        <Route path="/login" element={<Login />} />   
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Ajoute d'autres routes si nécessaire */}
        <Route path="/admin" element={<AdminPage />} />
        {/* Route pour la page admin, accessible uniquement aux managers */}
      </Routes>
    </Router>
  );
}

export default App;
