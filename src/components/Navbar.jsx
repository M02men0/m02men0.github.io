import React, { useState, useEffect } from 'react';
import "../styles/Navbar.css";

const THEMES = ["dark", "dark2", "light", "light2", "sunset", "forest"];

function Navbar() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('site-theme') || document.documentElement.dataset.theme || 'dark';
    } catch (e) {
      return document.documentElement.dataset.theme || 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('site-theme', theme); } catch (e) {}
  }, [theme]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: 'var(--bg-surface-1)'}}>
      <div className="container-fluid">
        <a href="#" className="navbar-brand" style={{ color: 'var(--text-primary-1)', fontFamily: 'Montserrat', fontWeight: 'bold', fontSize: '1.5rem' }}>
          MOEMEN ELGAZZAR
        </a>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#main-nav" 
          aria-controls="main-nav" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="main-nav" className="collapse navbar-collapse justify-content-end align-center">
          <ul className="navbar-nav">
            <li className="nav-item"><a href="#about" className="nav-link">About</a></li>
            <li className="nav-item"><a href="#projects" className="nav-link">Projects</a></li>
            <li className="nav-item"><a href="#experience" className="nav-link">Experience</a></li>
            <li className="nav-item"><a href="#skills" className="nav-link">Skills</a></li>
            <li className="nav-item"><a href="#contact" className="nav-link">Contact</a></li>

            <li className="nav-item theme-picker">
              <label htmlFor="theme-select" className="visually-hidden">Theme</label>
              <select id="theme-select" aria-label="Select theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
                {THEMES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
