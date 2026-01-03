import React from 'react';
import '../styles/Contact.css';
import GithubIcon from "../assets/icons/github.svg";
import LinkedInIcon from "../assets/icons/linkedin.svg";
import mailIcon from "../assets/icons/mail.svg";


export default function ContactSection() {
  return (
    <>
      <section id="contact">
        <div className="container pt-5">
          <div className="row justify-content-center">
            <div className="col-lg-12 text-center">
              <h1 className="section-title">Contact</h1>
              <h3 className="sourcesanspro-text" style={{ fontSize: '1.25rem', paddingBottom: '1rem' }}>
                Contact me by sending me a message directly or through my socials below!
              </h3>
              <div className="text-center">
                <button className="social-buttons" onClick={() => window.location.href = 'https://github.com/M02men0'}>
                  <img src={GithubIcon} alt="Github Logo" width="50rem" height="auto" />
                </button>
                <button className="social-buttons" onClick={() => window.location.href = 'https://www.linkedin.com/in/mteeng/'}>
                  <img src={LinkedInIcon} alt="Linkedin Logo" width="50rem" height="auto" />
                </button>
                <button className="social-buttons" onClick={() => window.location.href = 'mailto:moemenomar2006@gmail.com'}>
                  <img src={mailIcon} alt="Email Logo" width="50rem" height="auto" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer mt-5" style={{ backgroundColor: '#212122' }}>
        <div className="container text-center">
          <div className="col-12 p-2">
            <h3 style={{ color: '#efefef', fontFamily: 'Source Sans Pro', fontSize: '1rem' }}>
              ⚙️ Built by Moemen Elgazzar ⚙️ | Original design by RAHIM AZIZ
            </h3>
          </div>
        </div>
      </footer>
    </>
  );
}
