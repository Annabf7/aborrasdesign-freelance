import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import NavigationMenu from "./components/NavigationMenu";
import AuthPage from "./components/AuthPage";
import RegistrationSuccesful from "./components/RegistrationSuccesful";
import SignIn from "./components/SignIn";
import ShowreelImage from "./components/ShowreelImage";
import AnimationProjects from "./components/AnimationProjects";
import PortraitSection from "./components/PortraitSection";
import ProfileSection from "./components/ProfileSection";
import { FooterBlack, FooterWhite } from "./components/Footer";
import AboutSection from "./components/AboutSection";
import GenerativeArt from "./components/GenerativeArt";
import GenerativeArtGallery from "./components/GenerativeArtGallery";
import GenerativeArtCustomization from "./components/GenerativeArtCustomization";
import GenerativeArtSelection from "./components/GenerativeArtSelection"; // Afegeix l'import del GenerativeArtSelection
import GenerativeSketch1 from "./components/GenerativeSketch1";
import GenerativeSketch2 from "./components/GenerativeSketch2";
import GenerativeSketch3 from "./components/GenerativeSketch3";
import GenerativeSketch4 from "./components/GenerativeSketch4";
import GenerativeSketch5 from "./components/GenerativeSketch5";
import GenerativeSketch6 from "./components/GenerativeSketch6";
import GenerativeSketch7 from "./components/GenerativeSketch7";
import GenerativeSketch8 from "./components/GenerativeSketch8";
import { ArtworkProvider } from "./components/ArtworkContext";
import ChooseYourArtworkSize from "./components/ChooseYourArtworkSize";
import ThisWasAdded from "./components/ThisWasAdded";
import ViewInSpace from "./components/ViewInSpace";
import CheckOut from "./components/CheckOut";
import ShippingInfo from "./components/ShippingInfo";
import { ShippingProvider } from "./components/ShippingContext";
import CompletePayment from "./components/CompletePayment";
import { CartProvider } from "./components/CartContext";
import PhotographySection from "./components/PhotographySection";
import WebFrontEndSection from "./components/WebFrontEndSection";
import MotionGraphicSection from "./components/MotionGraphicSection";

import "./App.css";

function App() {
  return (
    <CartProvider>
      <ArtworkProvider>
        <ShippingProvider>
          <Router>
            <NavigationMenu />

            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <ShowreelImage />
                    <AnimationProjects />
                    <PortraitSection />
                    <ProfileSection />
                    {/* Mostra el FooterWhite a la pàgina principal */}
                    <FooterBlack />
                  </div>
                }
              />
              <Route
                path="/about"
                element={
                  <div>
                    <AboutSection />
                    <GenerativeArt />
                    <FooterBlack />
                  </div>
                }
              />
              <Route
                path="/auth"
                element={
                  <div>
                    <AuthPage />
                    <FooterWhite />
                  </div>
                }
              />
              <Route
                path="/registration-successful"
                element={
                  <div>
                    <RegistrationSuccesful />
                    <FooterWhite />
                  </div>
                }
              />

              <Route
                path="/login"
                element={
                  <div>
                    <SignIn />
                    <FooterWhite />
                  </div>
                }
              />

              <Route
                path="/generative-art"
                element={
                  <div>
                    <GenerativeArtGallery />
                    <FooterBlack />
                  </div>
                }
              />
              <Route
                path="/generative-art/selection"
                element={
                  <div>
                    <GenerativeArtSelection /> {/* Afegeix la nova pàgina de selecció */}
                    <FooterBlack />
                  </div>
                }
              />

              <Route path="/generative-art/style-1" element={<GenerativeSketch1 />} />
              <Route path="/generative-art/style-2" element={<GenerativeSketch2 />} />
              <Route path="/generative-art/style-3" element={<GenerativeSketch3 />} />
              <Route path="/generative-art/style-4" element={<GenerativeSketch4 />} />
              <Route path="/generative-art/style-5" element={<GenerativeSketch5 />} />
              <Route path="/generative-art/style-6" element={<GenerativeSketch6 />} />
              <Route path="/generative-art/style-7" element={<GenerativeSketch7 />} />
              <Route path="/generative-art/style-8" element={<GenerativeSketch8 />} />

              <Route
                path="/customize-art"
                element={
                  <div>
                    <GenerativeArtCustomization />
                    <FooterBlack />
                  </div>
                }
              />

              <Route
                path="/choose-your-artwork-size"
                element={
                  <div>
                    <ChooseYourArtworkSize />
                    <FooterBlack /> {/* Afegeix el footer aquí */}
                  </div>
                }
              />

              {/* Ruta per ThisWasAdded */}
              <Route
                path="/this-was-added"
                element={
                  <div>
                    <ThisWasAdded />
                    <FooterBlack />
                  </div>
                }
              />

              <Route
                path="/view-in-space"
                element={
                  <div>
                    <ViewInSpace />
                    <FooterBlack />
                  </div>
                }
              />

              <Route
                path="/CheckOut"
                element={
                  <div>
                    <CheckOut />
                    <FooterBlack />
                  </div>
                }
              />

              <Route
                path="/shippinginfo"
                element={
                  <div>
                    <ShippingInfo />
                    <FooterBlack />
                  </div>
                }
              />

              <Route
                path="/completepayment"
                element={
                  <div>
                    <CompletePayment />
                    <FooterBlack />
                  </div>
                }
              />

              <Route
                path="/photography"
                element={
                  <div>
                    <PhotographySection />
                    <FooterWhite />
                  </div>
                }
              />
              <Route
                path="/webfrontend"
                element={
                  <div>
                    <WebFrontEndSection />
                    <FooterBlack />
                  </div>
                }
              />
              <Route
                path="/motiongraphic"
                element={
                  <div>
                    <MotionGraphicSection />
                    <FooterWhite />
                  </div>
                }
              />
            </Routes>
          </Router>
        </ShippingProvider>
      </ArtworkProvider>
    </CartProvider>
  );
}

export default App;
