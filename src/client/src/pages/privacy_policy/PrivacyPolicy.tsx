import React from "react";
import MetaData from "../../MetaData";
import Footer from "../../components/footer/Footer";
import styled from "styled-components";
import { Typography } from "@mui/material";

const PrivacyPolicyPage = () => {
  return (
    <>
      <MetaData title="Privacy/Policy" />

      <PolicyRenderer>
        <Typography variant="h5" component="h5" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography className="privacy-policy-text" variant="body1">
          This Privacy Policy explains how we collect, use, and protect your
          personal information when you use our Website. By using our Website,
          you consent to the practices described in this Privacy Policy.
          <br />
          <strong>
            <u>Information Collection</u>
          </strong>
          <br />
          We may collect personal information such as your name, email address,
          and contact details when you voluntarily provide them to us through
          forms or account registration.
          <br />
          <strong>
            <u>Information Usage</u>
          </strong>
          <br />
          We may use your personal information to provide and improve our
          services, personalize your experience, send you updates and
          notifications, and respond to your inquiries.
          <br />
          <strong>
            <u>Information Sharing</u>
          </strong>
          <br />
          We do not sell, trade, or rent your personal information to third
          parties. However, we may share your information with trusted service
          providers who assist us in operating our Website and delivering our
          services.
          <br />
          <strong>
            <u>Data Security</u>
          </strong>
          <br />
          We employ industry-standard security measures to protect your personal
          information from unauthorized access, disclosure, alteration, or
          destruction.
          <br />
          <strong>
            <u>Cookies</u>
          </strong>
          <br />
          Our Website may use cookies and similar technologies to enhance your
          browsing experience. You may choose to disable cookies in your browser
          settings, but this may affect certain functionalities of the Website.
          <br />
          <strong>
            <u>Third-Party Links</u>
          </strong>
          <br />
          Our Website may contain links to third-party websites. We are not
          responsible for the privacy practices or content of these websites. We
          encourage you to review the privacy policies of those third parties.
        </Typography>
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
    font-size: 14px;
    color: #000;
    width: 70%;
    background-color: #fff;
    border: 1px solid #ededed;
    padding: 16px;
    border-radius: 8px;
    margin-top: 16px;
    line-height: 1.6rem;
  }

  @media (max-width: 767px) {
    .privacy-policy-text {
      width: 100%;
    }

    h2 {
      font-size: 1.8rem;
    }
  }
`;
