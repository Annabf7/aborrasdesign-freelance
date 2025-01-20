import React from "react";
import ServicesSection from "./ServicesSection";
import PhotoCorporatePortraits from "./PhotoCorporatePortraits";
import ContactForm from "./ContactForm";
import conceptIcon from "../assets/concept.png";
import fotoIcon from "../assets/foto.png";
import motionIcon from "../assets/motion.png";
import playIcon from "../assets/play.png";


const AutomationDesignSection = () => {
  return (
    <>
      <div className="section-wrapper automation-section">
        <div className="hero-image"></div>
        <div className="content-wrapper">
          <h1 className="title">Automation Design</h1>
          <p className="description">
            Streamlining processes and integrating automated workflows to boost productivity
          </p>
        </div>
      </div>

      <ServicesSection />

      <PhotoCorporatePortraits
        title="Automation Workflows"
        description={
          <>
            <p>
              In Automation Design, we focus on creating and deploying streamlined solutions that
              reduce manual tasks, improve efficiency, and ensure consistency across workflows.
            </p>
            <p>
              From initial planning to final implementation, each automation is carefully tested and
              iterated upon to guarantee reliability. By integrating the right tools and
              technologies, we help bring your processes into an optimal, future-proof state.
            </p>
            <p>
              The end result is an environment where repetitive actions are minimized, letting you
              and your team focus on creativity, analysis, and growth. Ready to transform your daily
              workflow?
            </p>
          </>
        }
        services={[
          {
            icon: conceptIcon,
            title: "Planning & Mapping",
            description:
              "We start by dissecting your current workflows, identifying bottlenecks and opportunities for automation. Through thorough planning, we ensure every step is accounted for before design begins.",
          },
          {
            icon: fotoIcon,
            title: "Process Development",
            description:
              "Here we craft the actual scripts, integrations, or custom code that automate your tasks. By utilizing industry-proven tools, we make sure every workflow is robust and secure.",
          },
          {
            icon: motionIcon,
            title: "Testing & Iteration",
            description:
              "Once prototypes are ready, we rigorously test them in real scenarios. This stage may involve multiple iterations to guarantee stability, performance, and a seamless user experience.",
          },
          {
            icon: playIcon,
            title: "Deployment & Training",
            description:
              "Finally, we deploy the automations into your environment and ensure your team is well-trained to harness them effectively. The goal is a confident handover where everything runs smoothly from day one.",
          },
        ]}
      />

       <div className="video-automation-container">
         <video
           className="automation-video"
           src={require("../assets/automation.mp4")}
           loop
           autoPlay
           playsInline
           muted
          onMouseEnter={(e) => {
           // Al posar-hi el cursor, el desmutegem
          e.currentTarget.muted = false;
          }}
          onMouseLeave={(e) => {
           // Al treure el cursor, tornem a mute
           e.currentTarget.muted = true;
          }}
          ></video>
       </div>
       
      <div className="contact-section">
        <ContactForm />
      </div>
    </>
  );
};

export default AutomationDesignSection;
