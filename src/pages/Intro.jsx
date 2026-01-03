import React from 'react';
import { ReactTyped } from 'react-typed';

import IntroPic from "../assets/gallery/my-notion-face.png";
import GithubIcon from "../assets/icons/github.svg";
import LinkedInIcon from "../assets/icons/linkedin.svg";

import "../styles/Intro.css";


function Intro() {
  return (
    <section id="intro">
      <div className="container">
        <div className = "row justify-content-center align-items-center py-4">

          {/* Decorative Symbols */}
          <ul className ="symbols">
            <li>
                <svg fill="var(--accent)" version="1.1" id="Capa_1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink" viewBox="0 0 460 460" xmlSpace="preserve" stroke="var(--accent)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_883_" d="M382.677,215c-6.373-20.048-25.161-34.615-47.292-34.615c-14.19,0-26.999,5.998-36.05,15.58 C285.164,154.722,245.99,125,200,125H90c-8.284,0-15,6.716-15,15v30H0v30h75v60H0v30h75v30c0,8.284,6.716,15,15,15h110 c45.99,0,85.164-29.722,99.334-70.964c9.052,9.582,21.86,15.58,36.05,15.58c22.131,0,40.919-14.568,47.292-34.615H460v-30H382.677z M200,305h-95V155h95c41.355,0,75,33.645,75,75S241.355,305,200,305z M335.385,249.615c-10.815,0-19.615-8.799-19.615-19.615 s8.8-19.615,19.615-19.615S355,219.184,355,230S346.2,249.615,335.385,249.615z"></path> </g></svg>                    
            </li>
            <li>
                <svg fill="var(--accent)" version="1.1" id="Capa_1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink" viewBox="0 0 459.101 459.101" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_1468_"> <polygon id="XMLID_1469_" points="244.551,238.037 244.551,27.05 214.551,27.05 214.551,238.037 0,238.037 0,268.037 459.101,268.037 459.101,238.037 "></polygon> <rect id="XMLID_1470_" x="49.551" y="320.043" width="360" height="30"></rect> <rect id="XMLID_1471_" x="94.551" y="402.05" width="270" height="30"></rect> </g> </g></svg>                    
            </li>
            <li>
                <svg fill="var(--accent)" version="1.1" id="Capa_1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink" viewBox="0 0 460 460" xmlSpace="preserve" stroke="var(--accent)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_995_"> <path id="XMLID_1006_" d="M420.259,349.062C368.529,300.485,300.961,273.732,230,273.732c-70.961,0-138.53,26.753-190.259,75.329 l20.536,21.869c43.688-41.025,98.74-63.202,154.723-66.563V460h30V304.368c55.983,3.36,111.035,25.538,154.722,66.563 L420.259,349.062z"></path> <polygon id="XMLID_1007_" points="410,146 245,146 245,0 215,0 215,146 50,146 50,176 410,176 "></polygon> </g> </g></svg>
            </li>
            <li>
                <svg fill="var(--accent)" version="1.1" id="Capa_1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink" viewBox="0 0 450 450" xmlSpace="preserve" stroke="var(--accent)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_838_" d="M327.697,49.521V0h-30v36.644c-19.379-6.448-40.091-9.951-61.608-9.951 c-103.663,0-188.731,81.076-195.16,183.146H18.346v30h22.976c8.92,99.627,92.858,177.984,194.766,177.984 c21.517,0,42.229-3.502,61.608-9.951V450h30v-55.006c61.791-32.903,103.957-97.983,103.957-172.737S389.487,82.423,327.697,49.521z M236.089,56.692c13.632,0,26.88,1.668,39.563,4.79l-81.305,81.305V120h-30v89.838H70.988 C77.36,124.324,148.973,56.692,236.089,56.692z M305.534,372.533l-44.161-41.883h15.66v-30h-48.687c-8.284,0-15,6.716-15,15v48.686 h30V354.9l30.205,28.647c-12.042,2.796-24.582,4.276-37.462,4.276c-85.355,0-155.824-64.926-164.631-147.984h92.889V330h30V185.213 l112.58-112.58c55.951,26.596,94.727,83.664,94.727,149.624C401.654,288.763,362.232,346.227,305.534,372.533z"></path> </g></svg>
            </li>
            <li>
                <svg fill="var(--accent)" version="1.1" id="Capa_1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink" viewBox="0 0 460 460" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_1365_" d="M335,222.5V109.167c0-8.284-6.716-15-15-15h-70v30h55v93.401L147.965,120.93 c-4.629-2.848-10.435-2.97-15.179-0.319c-4.743,2.651-7.683,7.66-7.683,13.094V222.5H0v30h125.104v88.794 c0,5.434,2.939,10.443,7.683,13.094c2.277,1.272,4.798,1.906,7.317,1.906c2.729,0,5.455-0.744,7.861-2.225L305,257.432v108.401h30 V252.5h125v-30H335z M155.104,314.451V160.549L280.148,237.5L155.104,314.451z"></path> </g></svg>
            </li>
            <li>
                <svg fill="var(--accent)" version="1.1" id="Capa_1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink" viewBox="0 0 460 460" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_1013_"> <polygon id="XMLID_1271_" points="65,215 10,215 10,245 65,245 65,460 95,460 95,0 65,0 "></polygon> <rect id="XMLID_1272_" x="245" width="30" height="460"></rect> <path id="XMLID_1275_" d="M450,215h-55V100c0-8.284-6.716-15-15-15h-60c-8.284,0-15,6.716-15,15v260c0,8.284,6.716,15,15,15h60 c8.284,0,15-6.716,15-15V245h55V215z M365,345h-30V115h30V345z"></path> <path id="XMLID_1279_" d="M200,85h-60c-8.284,0-15,6.716-15,15v260c0,8.284,6.716,15,15,15h60c8.284,0,15-6.716,15-15V100 C215,91.716,208.284,85,200,85z M185,345h-30V115h30V345z"></path> </g> </g></svg>
            </li>
            <li>
                <svg fill="var(--accent)" version="1.1" id="Capa_1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink" viewBox="0 0 440 440" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_2_"> <path id="XMLID_1166_" d="M390.334,205c-7.621-86.85-80.74-155.203-169.535-155.203S58.886,118.15,51.265,205H0v30h51.265 c7.621,86.85,80.739,155.203,169.534,155.203S382.713,321.85,390.334,235H440v-30H390.334z M220.799,360.203 c-77.308,0-140.203-62.895-140.203-140.203S143.491,79.797,220.799,79.797S361.002,142.692,361.002,220 S298.107,360.203,220.799,360.203z"></path> <path id="XMLID_1169_" d="M206.844,124.476L141.639,295.31h34.167l15.64-42.588h59.671l15.88,42.588h34.167l-64.965-170.834 H206.844z M196.979,229.383l24.542-67.131l23.58,67.131H196.979z"></path> </g> </g></svg>
            </li>
            <li>
                <svg fill="var(--accent)" version="1.1" id="Capa_1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink" viewBox="0 0 460 460" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_1382_"> <polygon id="XMLID_1383_" points="460,215 314,215 314,50 284,50 284,410 314,410 314,245 460,245 "></polygon> <polygon id="XMLID_1384_" points="146,215 0,215 0,245 146,245 146,410 176,410 176,50 146,50 "></polygon> </g> </g></svg>
            </li>
            <li>
                <svg fill="var(--accent)" version="1.1" id="Capa_1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink" viewBox="0 0 462.782 462.782" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_21_"> <path id="XMLID_904_" d="M350.272,323.014c-5.974,0-11.411-3.556-13.783-9.091l-50.422-117.65l-40.505,116.662 c-2.08,5.989-7.699,10.023-14.038,10.08c-0.044,0-0.089,0-0.133,0c-6.286,0-11.911-3.921-14.081-9.831l-41.979-114.358 l-40.798,114.234c-2.095,5.867-7.599,9.828-13.827,9.952c-6.242,0.127-11.886-3.615-14.213-9.394l-31.482-78.172H0v-30h85.141 c6.121,0,11.627,3.719,13.914,9.396l20.511,50.93l41.446-116.048c2.124-5.947,7.745-9.927,14.06-9.955c0.022,0,0.044,0,0.066,0 c6.289,0,11.912,3.923,14.081,9.831l41.779,113.814l39.431-113.565c2.032-5.851,7.451-9.852,13.64-10.071 c6.203-0.217,11.877,3.389,14.317,9.082l49.683,115.927l15.254-48.815c1.957-6.262,7.756-10.526,14.317-10.526h85.141v30h-74.113 l-24.076,77.043c-1.873,5.994-7.281,10.186-13.553,10.506C350.784,323.007,350.527,323.014,350.272,323.014z"></path> </g> </g></svg>
            </li>
            <li>
                <svg fill="var(--accent)" version="1.1" id="Capa_1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink" viewBox="0 0 460 460" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_1026_"> <polygon id="XMLID_1042_" points="245,120 215,120 215,155 180,155 180,185 215,185 215,220 245,220 245,185 280,185 280,155 245,155 "></polygon> <path id="XMLID_1220_" d="M407.258,230c0-92.688-71.512-168.976-162.258-176.617V0h-30v53.383 C124.254,61.024,52.742,137.313,52.742,230c0,92.944,71.907,169.403,163.01,176.684V460h30v-53.45 C336.14,398.551,407.258,322.431,407.258,230z M230,377.258c-81.198,0-147.257-66.06-147.257-147.258S148.802,82.742,230,82.742 S377.258,148.802,377.258,230S311.198,377.258,230,377.258z"></path> <rect id="XMLID_1440_" x="180" y="275" width="100" height="30"></rect> </g> </g></svg>
            </li>
          </ul>
          
          {/* Left side: Text content */}
          <div className="col-sm-6 text-left">
            <p className="typewriter-title" style={{ marginTop: '10rem' }}>🚧🚧Website still under construction 🚧🚧</p>
            <h1 className="name">MOEMEN ELGAZZAR</h1>

            <div className="typewriter-title" style={{ marginTop: '1rem' }}>
              <ReactTyped
                strings={[
                  '🖥️Computer Engineering @ University Of Waterloo',
                  '👨‍💻Seeking Spring 2026 CO-OP jobs',
                ]}
                typeSpeed={35}
                backSpeed={30}
                loop
                backDelay={3000}
              />
            </div>

            {/* Social Buttons */}
            <div style={{ marginLeft: '-1rem'}}>
              <button
                type="button"
                className="social-buttons"
                onClick={() => window.open('https://www.linkedin.com/in/mteeng', '_blank')}
              >
                <img
                  src={LinkedInIcon}
                  alt="LinkedIn Logo"
                  className="header-img"
                  style={{ width: '50px', height: 'auto' }}
                />
              </button>

              <button
                type="button"
                className="social-buttons"
                onClick={() => window.open('https://github.com/M02men0', '_blank')}
              >
                <img
                  src={GithubIcon}
                  alt="GitHub Logo"
                  className="header-img"
                  style={{ width: '50px', height: 'auto' }}
                />
              </button>
            </div>
          </div>

          {/* Right side: Profile image */}
          <div className="col-sm-4 text-center d-none d-sm-block">
            <img
              src={IntroPic}
              alt="Graduation Picture"
              className="intro-image img-fluid"
              loading="eager"
            />
          </div>
        </div>
        <div className="row justify-content-center align-items-center">
          <div className="col-12 text-center">
            <span
              className="material-icons-outlined chevron-down"
              style={{ fontSize: '2rem', color: '#efefef' }}
            >
              expand_more
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Intro;
