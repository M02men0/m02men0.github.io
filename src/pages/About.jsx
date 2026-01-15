import React, { useState, useEffect } from 'react';
import "../styles/About.css";


function About() {
  return (
    <>
      <section id="about">
        <div className="container pt-5">
          <div className="row justify-content-around align-items-center">
            <div className="col-sm-7">
              <h1 className="section-title" style={{ color: "var(--text-primary-1)" }}>Hello!</h1>
              <div className="line-break" style={{ backgroundColor: "var(--text-primary-1)" }}></div>
              <p className="about-text">
                Hello! I'm <b>Moemen Elgazzar</b>, a first-year Computer Engineering student at the University of Waterloo.
                I'm interested in robotics, automation, vehicles, and embedded systems.
                I tend to enjoy working on projects that combine both software and hardware.                 
              </p>
              <p className="about-text">
                In my free time, I work on side projects, explore the outdoors, and travel. 
                Wherever I go, I take my camera with me. I photograph architecture, nature, wildlife, and motorsports - basically anything that catches my eye 📸 
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="divider" id="projects-divider">
      <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg"
      ><path d="M0 27L288 17L576 103L864 62L1152 94L1440 52L1440 0L1152 0L864 0L576 0L288 0L0 0Z" fill="var(--bg-page-1)"
      ></path><path d="M0 119L288 135L576 180L864 145L1152 139L1440 100L1440 50L1152 92L864 60L576 101L288 15L0 25Z" fill="#4d4d4d"
      ></path><path d="M0 238L288 203L576 254L864 212L1152 231L1440 219L1440 98L1152 137L864 143L576 178L288 133L0 117Z" fill="#848484"
      ></path><path d="M0 292L288 263L576 267L864 286L1152 263L1440 289L1440 217L1152 229L864 210L576 252L288 201L0 236Z" fill="#c0c0c0"
      ></path><path d="M0 321L288 321L576 321L864 321L1152 321L1440 321L1440 287L1152 261L864 284L576 265L288 261L0 290Z" fill="var(--bg-page-2)"
      ></path></svg>
      
      </section>
    </>
  );
}

export default About;
