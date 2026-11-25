import UWSign from "../assets/gallery/WATERLOO-FI.png";
import UWLogo from "../assets/logos/UniversityOfWaterloo_logo_vert_rgb.png";

import UWFELogo from "../assets/logos/UWFE-black.webp";
import UWFEImage1 from "../assets/gallery/UWFE-1.webp";
import UWFEImage2 from "../assets/gallery/UWFE-2.webp";

const experiences = [
  {
    id: 4,
    org: 'University Of Waterloo',
    role: 'BASc in Computer Engineering',
    duration: 'Since September 2025',
    image: UWSign,
    logo: UWLogo,
    link: 'https://uwaterloo.ca/',
    description: [
      'Current courses: ',
      'ECE 106 - Electricity and Magnetism  ',
      'ECE 108 - Discrete Mathematics and Logic 1  ',
      'ECE 124 - Digital Circuits and Systems  ',
      'ECE 140 - Linear Circuits  ',
      'MATH 119 - Calculus 2 for Engineering'
    ]
  },    
  {
    id: 3,
    org: 'UWaterloo Formula Electric',
    role: 'Suspension Subteam Member',
    duration: 'January 2026 - present, January 2025 - April 2025',
    image: UWFEImage1,
    logo: UWFELogo,
    link: '',
    description: [
      'Worked as part of the suspension sub-team designing and fabricating components for the UW Formula-style electric race car',
      'Designed and fabricated mechanical parts according to team drawings and tolerances',
      'Gained hands-on experience with machine shop tools and manufacturing processes'
    ],
    skills: ['Mechanical fabrication', 'Design iteration', 'Machine shop protocol'],
    gallery: [UWFEImage1, UWFEImage2]

  }
];

export default experiences;
