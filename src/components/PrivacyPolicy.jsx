import React from "react";
import "../styles/PrivacyPolicy.css"

const PrivacyPolicy = ({ onClose }) => {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h2>Privacy Policy</h2>
          <hr></hr>
      <p>
        At Aborrasdesign, we are committed to protecting your privacy. This Privacy Policy outlines
        how we collect, use, and safeguard your personal information.
      </p>

      <h3>1. Data Collection</h3>
      <p>
        We collect personal information when you register, place an order, or contact us. This may
        include your name, email, address, phone number, and payment details.
      </p>

      <h3>2. Data Usage</h3>
      <p>
        The collected data is used to process your orders, provide customer support, and improve
        our services. We may also use your information to send updates and promotional offers, with
        your consent.
      </p>

      <h3>3. Data Retention</h3>
      <p>
        We retain your data as long as it is necessary to provide our services. You can request the
        deletion of your data at any time by contacting us at <a href="mailto:aborrasdesign@gmail.com">aborrasdesign@gmail.com</a>.
      </p>

      <h3>4. Third-Party Sharing</h3>
      <p>
        We do not share your personal information with third parties, except when required for
        processing orders (e.g., payment providers like Stripe or printing services like Printful).
      </p>

      <h3>5. Security</h3>
      <p>
        We implement appropriate security measures to protect your data from unauthorized access,
        alteration, and destruction.
      </p>
      <h3>6. Cookies</h3>
          <p>
            To offer a secure and personalized experience, we use strictly necessary cookies for the correct
            functioning of the platform. These cookies are automatically managed by Firebase Authentication
            and do not store any personal information that directly identifies the user.
          </p>

          <h3>7. Your Rights</h3>
          <p>
            You have the right to access, modify, or delete your personal information. For any
            inquiries, please contact us at <a href="mailto:aborrasdesign@gmail.com">aborrasdesign@gmail.com</a>.
          </p>

          <h3>8. Changes to this Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this
            page with an updated revision date.
          </p>
    </div>
    </div>
  );
};

export default PrivacyPolicy;
