import React from "react";
import { Link, useLocation } from "react-router-dom";
import photoIcon from "../assets/foto.png";
import webFrontendIcon from "../assets/webfrontend.png";
import motionIcon from "../assets/motion.png";
import automationIcon from "../assets/automation.png";

const servicesData = [
  {
    iconSrc: photoIcon,
    title: "Digital Photography",
    className: "digitalPhotography",
    path: "/photography", 
  },
  {
    iconSrc: webFrontendIcon,
    title: "Web frontEnd",
    className: "webFrontEnd",
    path: "/webfrontend", 
  },
  {
    iconSrc: motionIcon,
    title: "Motion Graphic",
    className: "branding",
    path: "/motiongraphic", 
  },
  {
    iconSrc: automationIcon,
    title: "Automation Design",
    className: "automationDesign",
    path: "/automationdesign",
  },
];

const ServicesSection = () => {
  const location = useLocation(); 

  return (
    <section className="servicesIcons">
      {servicesData.map((service, index) => (
        <Link to={service.path} key={index}>
          <div
            className={`serviceItem ${service.className} ${
              location.pathname === service.path ? "active" : ""
            }`}
          >
            <img
              loading="lazy"
              src={service.iconSrc}
              alt={service.title}
              className={`serviceIcon ${location.pathname === service.path ? "activeIcon" : ""}`} 
            />
            <h3 className="serviceTitle">{service.title}</h3>
          </div>
        </Link>
      ))}
    </section>
  );
};

export default ServicesSection;
