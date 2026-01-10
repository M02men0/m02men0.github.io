
import AthanPi from "../assets/gallery/Pi.jpg";
import M4 from "../assets/gallery/M4.jpg";
import Arduino from "../assets/gallery/Arduino_uno.png";


const projects = [
    {
      id: 1,
      title: 'Athan Pi',
      group: 'embedded',
      description: 'A a Linux-based Python system running on a Raspberry Pi Zero 2 W. Plays athan and reminders @ precice timings.',
      image: AthanPi,
      imageType: 'landscape-img',
      link: 'https://github.com/M02men0/athanPi',
      badge_1: 'Rasberry Pi',
      badge_2: 'Python',
    },
    {
      id: 2,
      title: "Robotic arm tracer",
      group: "software",
      description: "Project still in the works, Working on a defence gymbal arm that tracks drones, and has an airsoft gun monted on top.",
      image: M4,
      imageType: 'landscape-img',
      link: "https://github.com/M02men0",
      badge_1: "Arduino",
      badge_2: "C++",
    },

    {
      id: 10,
      title: "Smart-Water",
      group: "embedded",
      description: "An automated plant watering system based on an STM32 Microcontroller.",
      image: Arduino,
      imageType: 'landscape-img',
      link: "https://github.com/SenthilShelke/Smart-Water",
      badge_1: "STM32",
      badge_2: "Schematic design",
    },
  ];

  export default projects;
