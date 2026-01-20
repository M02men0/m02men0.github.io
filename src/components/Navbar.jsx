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
    <>
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
              <li className="nav-item resume"><a href="#" className="nav-link" data-bs-toggle="modal" data-bs-target="#resumeModal">Resume</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Resume Selection Modal */}
      <div className="modal fade" id="resumeModal" tabIndex="-1" aria-labelledby="resumeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header border-0">
              <h5 className="modal-title" id="resumeModalLabel">Resume</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            {/* Body */}
            <div className="modal-body text-center">
              <a href="./files/Moemen_Elgazzar_Resume_V3.pdf" target="_blank" rel="noopener noreferrer" className="btn m-2">
                Download PDF
              </a>
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 justify-content-center">
              <p></p>
            </div> 

          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
