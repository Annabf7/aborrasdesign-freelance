import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavigationMenu from './components/NavigationMenu';
import Cart from './components/Cart';
import AuthPage from './components/AuthPage';
import PrivacyPolicy from "./components/PrivacyPolicy";
import { AuthProvider } from './components/AuthContext';
import RegistrationSuccesful from './components/RegistrationSuccesful';
import SignIn from './components/SignIn';
import UserProfile from './components/UserProfile';
import OrderHistory from './components/OrderHistory';
import ShowreelImage from './components/ShowreelImage';
import AnimationProjects from './components/AnimationProjects';
import PortraitSection from './components/PortraitSection';
import ProfileSection from './components/ProfileSection';
import { FooterBlack, FooterWhite } from './components/Footer';
import AboutSection from './components/AboutSection';
import GenerativeArtGallery from './components/GenerativeArtGallery';
import GenerativeArtCustomization from './components/GenerativeArtCustomization';
import GenerativeArtSelection from './components/GenerativeArtSelection'; 
import GenerativeSketch1 from './components/GenerativeSketch1';
import GenerativeSketch2 from './components/GenerativeSketch2';
import GenerativeSketch3 from './components/GenerativeSketch3';
import GenerativeSketch4 from './components/GenerativeSketch4';
import GenerativeSketch5 from './components/GenerativeSketch5';
import GenerativeSketch6 from './components/GenerativeSketch6';
import GenerativeSketch7 from './components/GenerativeSketch7';
import GenerativeSketch8 from './components/GenerativeSketch8';
import { ArtworkProvider } from './components/ArtworkContext';
import ChooseYourArtworkSize from './components/ChooseYourArtworkSize';
import ThisWasAdded from './components/ThisWasAdded';
import CheckOut from './components/CheckOut';
import ShippingInfo from './components/ShippingInfo';
import { ShippingProvider } from './components/ShippingContext';
import CompletePayment from './components/CompletePayment';
import Success from './components/Success';
import { CartProvider } from './components/CartContext';
import PhotographySection from './components/PhotographySection';
import WebFrontEndSection from './components/WebFrontEndSection';
import MotionGraphicSection from './components/MotionGraphicSection';
import AutomationDesignSection from "./components/AutomationDesignSection"; 
import './App.css';

function App() {
 

  return (
    <AuthProvider>
      <ShippingProvider>
        <CartProvider>
          <ArtworkProvider>
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
                    <FooterBlack />
                  </div>
                }
              />
              <Route
                path="/profile" 
                element={
                  <div>
                    <UserProfile />
                    <FooterWhite />
                  </div>
                }
              />
              <Route
                path="/order-history" 
                element={
                  <div>
                    <OrderHistory />
                    <FooterWhite />
                  </div>
                }
              />
              <Route
                path="/about"
                element={
                  <div>
                    <AboutSection />
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
                path="/privacy-policy" 
                element={<PrivacyPolicy />} 
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
                    <GenerativeArtSelection />
                    <FooterBlack />
                  </div>
                }
              />

              <Route
                path="/generative-art/style-1"
                element={<GenerativeSketch1 />}
              />
              <Route
                path="/generative-art/style-2"
                element={<GenerativeSketch2 />}
              />
              <Route
                path="/generative-art/style-3"
                element={<GenerativeSketch3 />}
              />
              <Route
                path="/generative-art/style-4"
                element={<GenerativeSketch4 />}
              />
              <Route
                path="/generative-art/style-5"
                element={<GenerativeSketch5 />}
              />
              <Route
                path="/generative-art/style-6"
                element={<GenerativeSketch6 />}
              />
              <Route
                path="/generative-art/style-7"
                element={<GenerativeSketch7 />}
              />
              <Route
                path="/generative-art/style-8"
                element={<GenerativeSketch8 />}
              />

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
                path="/choose-your-artwork-size/:productId"
                element={
                <div>
                  <ChooseYourArtworkSize />
                  <FooterBlack/>
                  </div>
                }
              />

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
                path="/success"
                element={
                  <div>
                    <Success />
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
               <Route path="/automationdesign" 
               element={
                  <div>
                     <AutomationDesignSection />
                     <FooterBlack />
                  </div>
                } 
              />
              <Route
                path="/cart"
                element={
                  <div>
                    <Cart />
                    <FooterBlack />
                  </div>
                }
              />
            </Routes>
          </ArtworkProvider>
        </CartProvider>
      </ShippingProvider>
    </AuthProvider>
  );
}

export default App;
