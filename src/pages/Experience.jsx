import React, { useState, useEffect } from 'react';
import "../styles/Experience.css";
import experienceData from "../helpers/ExperienceList.js"; 
// REMOVED: import skillsData from "../helpers/SkillsList.js"; 

// src/pages/Experience.jsx

// 1. ExperienceModal Component: The popup window - UPDATED FOR TEXT-ONLY SKILL BADGES
function ExperienceModal({ experience, onClose }) {
    if (!experience) {
        return null;
    }

    // Use useEffect to prevent body scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Handle background click to close modal
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content"> 
                {/* Close Button (X icon) */}
                <button className="modal-close-button" onClick={onClose}>
                    &times;
                </button>

                {/* New Header Banner/Card Section */}
                <div className="modal-header-banner">
                    
                    {/* Left Side: Logo (Now the clickable link) */}
                    {experience.link ? (
                        <a 
                            href={experience.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="modal-logo-link" // New class for styling the clickable container
                            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking the logo link
                        >
                            <div className="modal-logo-container">
                                <img 
                                    src={experience.logo} 
                                    alt={`${experience.org} Logo`} 
                                    className="modal-logo" 
                                    loading="lazy"
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/CCCCCC/2b2b2b?text=Logo" }} 
                                />
                            </div>
                        </a>
                    ) : (
                        <div className="modal-logo-container">
                            <img 
                                src={experience.logo} 
                                alt={`${experience.org} Logo`} 
                                className="modal-logo" 
                                loading="lazy"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/CCCCCC/2b2b2b?text=Logo" }} 
                            />
                        </div>
                    )}


                    {/* Right Side: Title, Role, Duration */}
                    <div className="modal-info-text">                        
                        {/* Organization Name and Role */}
                        <div className="name-tagline-wrapper mb-3">
                            <h2 className="sourcesanspro-text">{experience.org}</h2>
                            <h3 className="sourcesanspro-text">{experience.role}</h3>
                        </div>
                        
                        {/* Timeline/Duration */}
                        <div className="timeline-info text-gray-300 sourcesanspro-text mb-4">
                            <p className="timeline-text">{experience.duration}</p>
                        </div>

                        {/* REMOVED: Link Button - The logo is now the link */}
                    </div>
                </div>

                {/* Content Description Section (UPDATED TO USE UL/LI) */}
                <div className="modal-description-content">
                    <hr></hr>
                    <ul className="sourcesanspro-text" style={{ listStyleType: 'disc', paddingLeft: '20px', fontSize: '1.1rem', lineHeight: '1.6' }}>
                        {experience.description && Array.isArray(experience.description) && experience.description.length > 0 ? (
                            experience.description.map((point, index) => (
                                <li key={index} style={{ marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: point }} />
                            ))
                        ) : (
                            <li style={{ marginBottom: '0.5rem' }}>
                                Detailed description coming soon!
                            </li>
                        )}
                    </ul>
                </div>

                {/* NEW: Skills Used Section - Renders text badges only */}
                {experience.skills && experience.skills.length > 0 && (
                    <div className="modal-skills-content">
                        <hr></hr>
                        <div className="skill-badges-container"> {/* Container for layout */}
                            {experience.skills.map((skillName, index) => (
                                <span 
                                    key={index} 
                                    className="badge skill-badge" // Class for text-only badge styling
                                >
                                    {skillName}
                                </span>
                            ))}
                        </div>
                    </div>
                )}


                {/* Carousel Gallery Section (Conditional Rendering) */}
                {experience.gallery && experience.gallery.length > 0 && (
                    <div className="modal-gallery-section">
                        <h4 className="sourcesanspro-text">Gallery</h4>
                        
                        <div id={`experience-carousel-${experience.id}`} className="carousel slide" data-bs-ride="carousel">
                            
                            {/* Carousel Indicators (Dots) */}
                            <div className="carousel-indicators">
                                {experience.gallery.map((_, index) => (
                                    <button 
                                        key={index}
                                        type="button" 
                                        data-bs-target={`#experience-carousel-${experience.id}`} 
                                        data-bs-slide-to={index} 
                                        className={index === 0 ? 'active' : ''} 
                                        aria-current={index === 0 ? 'true' : 'false'}
                                        aria-label={`Slide ${index + 1}`}
                                    ></button>
                                ))}
                            </div>

                            {/* Carousel Inner (Images) */}
                            <div className="carousel-inner">
                                {experience.gallery.map((imageSrc, index) => (
                                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                        <img 
                                            src={imageSrc} 
                                            alt={`${experience.org} gallery image ${index + 1}`} 
                                            loading="lazy"
                                            className="d-block w-100 modal-gallery-image"
                                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x450/555555/efefef?text=Image+Error" }} 
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Carousel Controls (Prev/Next Buttons) */}
                            <button className="carousel-control-prev" type="button" data-bs-target={`#experience-carousel-${experience.id}`} data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target={`#experience-carousel-${experience.id}`} data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// 2. ExperienceCard Component: Now accepts an onClick handler
function ExperienceCard({ experience, onClick }) {
    return (
      <div className="timeline mt-5">
        <div className="row timeline-container">

          {/* 1. DESKTOP / TIMELINE VIEW (Hidden on Mobile via CSS) */}
          <div className="experience-desktop-view"> 
              <div className="experience-large-card" onClick={() => onClick(experience)}> 
                  <div
                      className="experience-large-card-preview"
                      style={{
                          backgroundImage: `url(${experience.image})`,
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat',
                      }}
                  >
                      <h2 style={{ color: "var(--text-primary-1)", paddingTop: '2%' }}>{experience.org}</h2>
                      <h3 style={{ color: "var(--text-secondary-1)", fontSize: '1rem' }}>{experience.role}</h3>
                      <h3 className="sourcesanspro-text" style={{ fontStyle: 'italic' }}>{experience.duration}</h3>
                      <div className="d-none d-sm-block mt-auto mb-auto">
                          {/* The logo/link button is kept for quick access, but the whole card opens the modal */}
                          <a className="btn btn-skills mx-0" style={{ maxWidth: '8rem', minWidth: '50px' }}> 
                              <img src={experience.logo} alt={`${experience.org} Logo`} className="timeline-icon" loading="lazy" />
                          </a>
                      </div>
                  </div>
              </div>
          </div>
          
          {/* 2. MOBILE / BLOCK VIEW (Shown on Mobile via CSS - matches General Dynamics style) */}
          <div className="experience-mobile-view" onClick={() => onClick(experience)}>
              <div className="mobile-logo-wrapper">
                  <img src={experience.logo} alt={`${experience.org} Logo`} loading="lazy" />
              </div>
              <div className="mobile-text-content">
                  <h2 className="sourcesanspro-text">{experience.org}</h2>
                  <h3 className="sourcesanspro-text">{experience.role}</h3>
                  <p className="sourcesanspro-text duration-text">{experience.duration}</p>
              </div>
          </div>

        </div>
      </div>
    );
  }
  
// 3. ExperienceSection Component: Handles the state and rendering
export default function ExperienceSection() {
    const [selectedExperience, setSelectedExperience] = useState(null); // State to hold the experience to display in the modal

    // Function to close the modal
    const closeModal = () => setSelectedExperience(null);

    return (
      <section id="experience">
        <div className="container pt-5">
          <h1 className="section-title">Experience</h1>
          <div className="line-break" style={{ backgroundColor: "var(--text-primary-1)" }}></div>
            <div className="timeline">
            {experienceData.map(exp => (
              <ExperienceCard 
                key={exp.id} 
                experience={exp} 
                onClick={setSelectedExperience} // Pass the state setter as the click handler
              />
            ))}
          </div>
        </div>

        {/* Render the modal only if selectedExperience is not null */}
        {selectedExperience && (
            <ExperienceModal 
                experience={selectedExperience} 
                onClose={closeModal} 
            />
        )}
      </section>
    );
  }