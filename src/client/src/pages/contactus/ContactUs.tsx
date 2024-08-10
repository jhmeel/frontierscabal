import React, { useState } from "react";
import Footer from "../../components/footer/Footer";
import MetaData from "../../MetaData";
import { IconWhatsapp } from "../../assets/icons";
import { useSnackbar } from "notistack";
import styled from "styled-components";

const ContactUs = () => {
  const [enquiry, setEnquiry] = useState("");
  const [subject, setSubject] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const messageUs = () => {
    const url = `https://wa.me/${"+2348081434636"}`;
    window.open(url, "_blank");
  };
  const handleSubmission = () => {
    if (!subject) {
      enqueueSnackbar("Subject is required!", { variant: "error" });
      return;
    } else if (!enquiry || enquiry.length < 5) {
      enqueueSnackbar("please provide a valid enquiry!", { variant: "error" });
      return;
    }
    const url = `mailto:frontierscabal@gmail.com?subject=${subject}&body=${enquiry}`;
    window.open(url, "_blank");

    setSubject("");
    setEnquiry("");
  };
  return (
    <>
      <MetaData title="Contact us" />
      <ContactusRenderer>
        <div className="contact-holder">
          <div className="contact-header">
            <h2>Contact Us!</h2>
            <p>
              If you have any questions, feedback, or inquiries, feel free to
              get in touch with us.
            </p>
          </div>
          <div className="contact-us-enq-cont">
            <label id='subject_label'>Subject*</label>
            <input
              title="Subject"
              autoFocus
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <label>Enquiries*</label>
            <textarea
              title="Enquiries"
              value={enquiry}
              onChange={(e) => setEnquiry(e.target.value)}
            />
            <button title="Submit" type="submit" onClick={handleSubmission}>
              Submit
            </button>
          </div>
          <div className="l-separator">
            <hr className="l-line" />
            <span style={{ color: "#176984", fontWeight: 700 }}>Or</span>
            <hr className="l-line" />
          </div>
          <div
            title="Message on whatsapp"
            className="contact-us-msg"
            onClick={messageUs}
          >
            Message us on whatsapp&nbsp;
            <IconWhatsapp fill="green" />
          </div>
          <p className="cnt-spt-txt">
            Our support team is available during business hours and will respond
            to your inquiries as soon as possible.
          </p>
        </div>
      </ContactusRenderer>

      <Footer />
    </>
  );
};

export default ContactUs;

const ContactusRenderer = styled.div`
  width: fit-content;
  height: 100vh;
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;

  .contact-holder {
    width: 100%;
    height: fit-content;
    background-color: white;
    border: 1px solid #ededed;
    padding: 5px 10px;
    border-radius: 8px;
    margin-top: 5px;
    align-items: center;
    justify-content: center;
  }
  .contact-us-enq-cont {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .contact-header p,
  .cnt-spt-txt {
    text-align: justify;
    font-size: 15px;
    color: #8b8e98;
    padding: 2px 4px;
    line-height:1.1;
  }
  .contact-us-enq-cont label {
    font-size: 0.75rem;
    color: #8b8e98;
    font-weight: 600;
    font-family: "Inter", sans-serif;
  }
  #subject_label{
    margin-top: 10px;
  }
  .contact-us-enq-cont textarea,
  input {
    width: auto;
    height: auto;
    padding: 10px;
    border-radius: 8px;
    outline: none;
    border: 1px solid #e5e5e5;
    color: #000;
    font-weight: 500;
    font-size: 16px;
    background-color: #fff;
  }

  .contact-us-enq-cont textarea,
  input:focus {
    border: 2px solid #187999;
  }
  .contact-us-enq-cont button {
    padding: 8px 18px;
    border: none;
    font-size: 12px;
    color: #fff;
    border-radius: 5px;
    margin-top: 10px;
    background-color: #176984;
    cursor: pointer;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
    width: fit-content;
  }

  @media (max-width: 767px) {
    .contact-holder {
      width: 100%;
    }
    .contact-cont {
      width: 100%;
    }
    h2 {
      font-size: 16px;
    }
    .contact-us-enq-cont label {
      font-size: 0.7rem;
    }
    .contact-header p,
    .cnt-spt-txt,
    .contact-us-msg {
      font-size: 14px;
    }
  }

  .l-separator {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    color: #8b8e98;
  }

  .l-separator .l-line {
    display: block;
    width: 100%;
    height: 1px;
    border: 0;
    background-color: #e8e8e8;
  }

  .contact-us-msg {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 158, 24, 0.237);
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-weight: 600;
    color: #393939;
    width: fit-content;
    margin: 5px 0px;
    transition: 0.3s ease-in-out;
    outline: none;
  }
  .contact-us-msg:hover {
    background-color: #176984;
    color: white;
    border: none;
  }
`;
