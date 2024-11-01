import React from "react";
import barcelonaImage from "../assets/barcelona.png";
import helloIcon from "../assets/hello.png";

const ProfileSection = () => {
  return (
    <div className="profile-section">
      <div className="profile-text">
        <h1 className="profile-title">
          LOGIC WILL GET YOU FROM A TO Z; IMAGINATION WILL GET YOU EVERYWHERE
        </h1>{" "}
        <p>
          <img src={helloIcon} alt="Hello icon" className="hello-icon" /> it's me, Anna, from
          Barcelona. <br></br>I’m a multimedia artist and developer, specializing in UX/UI design,
          frontend web development with React, and motion graphics. My passion lies in blending
          creativity with technology to deliver visually stunning and user-centric digital
          experiences. From initial inspiration to final execution, I’m involved in every step of
          the process: Inspiration, Research, Ideation, and Execution.<br></br> Aborrasdesign is
          more than just a portfolio—it’s a window into my world, where I showcase how I combine
          creativity, usability, and cutting-edge technologies. My goal is to connect with potential
          clients by offering an interactive experience that reflects my vision and approach to
          digital creation.
        </p>
      </div>
      <img className="profile-icon" src={barcelonaImage} alt="Profile Icon" />
    </div>
  );
};

export default ProfileSection;
