import React from "react";
import MetaData from "../../MetaData";
import Footer from "../../components/footer/Footer";
import styled from "styled-components";

const PrivacyPolicyPage = () => {
  return (
    <>
      <MetaData title="Privacy/Policy" />
      <PolicyRenderer>
        <h2>Privacy Policy</h2>
        <p className="privacy-policy-text">
          This Privacy Policy explains how we collect, use, and protect your
          personal information when you use our Website. By using our Website,
          you consent to the practices described in this Privacy Policy.
          <br />
          <b>
            <u>Information Collection </u>
          </b>{" "}
          <br />
          We may collect personal information such as your name, email address,
          and contact details when you voluntarily provide them to us through
          forms or account registration. <br />
          <b>
            <u>Information Usage</u>
          </b>{" "}
          <br />
          We may use your personal information to provide and improve our
          services, personalize your experience, send you updates and
          notifications, and respond to your inquiries.
          <br />
          <b>
            <u>Information Sharing </u>
          </b>{" "}
          <br />
          We do not sell, trade, or rent your personal information to third
          parties. However, we may share your information with trusted service
          providers who assist us in operating our Website and delivering our
          services. <br />
          <b>
            <u>Data Security </u>
          </b>
           <br />
          We employ industry-standard security measures to protect your personal
          information from unauthorized access, disclosure, alteration, or
          destruction.
          <br />
          <b>
            <u>Cookies</u>
          </b>
          <br />
          Our Website may use cookies and similar technologies to enhance your
          browsing experience. You may choose to disable cookies in your browser
          settings, but this may affect certain functionalities of the Website.{" "}
          <br />
          <b>
            <u>Third-Party Links</u>
          </b>
          <br /> Our Website may contain links to third-party websites. We are
          not responsible for the privacy practices or content of these
          websites. We encourage you to review the privacy policies of those
          third parties.
        </p>
      </PolicyRenderer>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;

const PolicyRenderer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  flex-direction: column;

  .privacy-policy-text {
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    color: #000;
    width: 70%;
    background-color: white;
    border:1px solid #ededed;
    padding: 3px 6px;
    border-radius: 8px;
    margin-top: 5px;
    line-height: 1.6rem;
  }
  @media (max-width: 767px) {
    .privacy-policy-text {
      width: 100%;
    }
  }
`;
