import React from "react";
import MetaData from "../../MetaData";
import Footer from "../../components/footer/Footer";
import styled from "styled-components";

const TermsOfService = () => {
  return (
    <>
      <MetaData title="Terms-of-service" />

      <TermsRenderer>
        <h2>Terms of Service</h2>

        <div>
          This Terms of Service agreement governs your use of our website and
          any services or content provided therein.
          <br />
          <h3>Acceptance of Terms</h3>
          By accessing or using our Website, you agree to be bound by this
          Agreement. If you do not agree with any provisions of this Agreement,
          you may not use the Website.
          <br />
          <h3>Intellectual Property</h3>
          All content and materials on the Website, including but not limited to
          text, graphics, logos, images, and pdf files, are the property of our
          website or its licensors and are only free to use or share by users of
          our website.
          <br />
          <h3>User Conduct</h3>
          You agree to use the Website in a lawful and responsible manner and
          not to engage in any activities that may harm the Website or other
          users. Prohibited activities include, but are not limited to,
          unauthorized access, distribution of malware, and violation of
          third-party rights.
          <h3>Disclaimer of Warranties</h3>
          <p>
            The Website and its content are provided on an "as is" basis without
            warranties of any kind. <br />
            The answers provided in the documents are intended to assist users
            in understanding past questions and potential solutions. We do not
            guarantee the absolute accuracy, completeness, or reliability of the
            answers. Any actions taken based on the material are at the user 's
            own risk. We shall not be held responsible for any negative outcomes
            resulting from the use of the material. Users are strongly advised
            to independently cross-verify the information, validate answers and
            exercise their own judgment before making decisions based on the
            content.
          </p>
          <h3>Limitation of Liability</h3>
          We shall not be liable for any damages or losses arising from your use
          of the Website or reliance on its content. This includes direct,
          indirect, incidental, or consequential damages.
          <h3>Links to Third-Party Websites</h3>
          Our Website may contain links to third-party websites for your
          convenience. We do not endorse or assume any responsibility for the
          content or practices of these websites.
          <h3>Modifications to the Agreement</h3>
          We reserve the right to modify or terminate this Agreement at any
          time. It is your responsibility to review this Agreement periodically
          for any changes.
        </div>
      </TermsRenderer>

      <Footer />
    </>
  );
};

export default TermsOfService;

const TermsRenderer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  flex-direction: column;

  div {
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
    div {
      width: 100%;
    }
  }
  h3 {
    text-decoration: underline;
    text-transform: capitalize;
  }
`;
