import React from "react";

function PhotoCorporatePortraits({ title, description, services }) {
  return (
    <section className="photo-explanation">
      <div className="photo-flexContainer">
        <div className="photo-leftColumn">
          <div className="photo-contentWrapper">
            <h1 className="photo-title">{title}</h1>
            <div className="photo-description">{description}</div>
            <button className="photo-ctaButton">
              <span className="photo-ctaText">more info!</span>
            </button>
          </div>
        </div>
        <div className="photo-rightColumn">
          <div className="photo-servicesContainer">
            <div className="photo-flexContainer">
              {services.slice(0, 2).map((service, index) => (
                <div key={index} className="photo-serviceColumn">
                  <div className="photo-serviceContent">
                    <img src={service.icon} alt="" className="photo-serviceIcon" />
                    <h2 className="photo-serviceTitle">{service.title}</h2>
                    <span className="photo-serviceDescription">{service.description}</span>{" "}
                  </div>
                </div>
              ))}
            </div>
            <div className="photo-serviceRow">
              {services.slice(2).map((service, index) => (
                <div key={index + 2} className="photo-serviceColumn">
                  <div className="photo-serviceContent">
                    <img src={service.icon} alt="" className="photo-serviceIcon" />
                    <h2 className="photo-serviceTitle">{service.title}</h2>
                    <span className="photo-serviceDescription">{service.description}</span>{" "}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PhotoCorporatePortraits;
