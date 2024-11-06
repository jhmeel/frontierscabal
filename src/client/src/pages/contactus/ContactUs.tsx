import React, { useState } from "react";
import Footer from "../../components/footer/Footer";
import MetaData from "../../MetaData";
import { IconWhatsapp } from "../../assets/icons";
import { useSnackbar } from "notistack";
import { TextField, Button, Typography, Divider, Box } from "@mui/material";
import { styled } from "@mui/system";
import Div100vh from 'react-div-100vh'

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
      enqueueSnackbar("Please provide a valid enquiry!", { variant: "error" });
      return;
    }
    const url = `mailto:frontierscabal@gmail.com?subject=${subject}&body=${enquiry}`;
    window.open(url, "_blank");

    setSubject("");
    setEnquiry("");
  };

  return (
    <>
      <MetaData title="Contact Us" />
      <Div100vh>
      <StyledContactUs>
        <Box className="contact-holder">
          <Box className="contact-header">
            <Typography variant="h5">Contact Us!</Typography>
            <Typography variant="body1" className="contact-description">
              If you have any questions, feedback, or inquiries, feel free to get in touch with us.
            </Typography>
          </Box>
          <Box className="contact-us-enq-cont">
            <TextField
            size="small"
              id="subject"
              label="Subject*"
              variant="outlined"
              fullWidth
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              margin="normal"
            />
            <TextField
            size="small"
              id="enquiry"
              label="Enquiry*"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={enquiry}
              onChange={(e) => setEnquiry(e.target.value)}
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSubmission}>
              Submit
            </Button>
          </Box>
          <Divider className="l-separator">
            <Typography style={{ fontWeight: 700, color: "#176984" }}>Or</Typography>
          </Divider>
          <Button variant="outlined" color="success" onClick={messageUs} startIcon={<IconWhatsapp />}>
            Message us on WhatsApp
          </Button>
          <Typography className="cnt-spt-txt" variant="body2">
            Our support team is available during business hours and will respond to your inquiries as soon as possible.
          </Typography>
        </Box>
      </StyledContactUs>
      </Div100vh>
      <Footer />
    </>
  );
};

export default ContactUs;

const StyledContactUs = styled(Box)`
  width: 100%;
  height: 100vh;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
  font-family: "Roboto", sans-serif;

  .contact-holder {
    width: 100%;
    max-width: 600px;
    background-color: #fff;
    border: 1px solid #ededed;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .contact-header {
    margin-bottom: 20px;
    text-align: center;
  }

  .contact-description {
    color: #8b8e98;
    margin-top: 8px;
  }

  .contact-us-enq-cont {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .l-separator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 20px 0;
  }

  .cnt-spt-txt {
    text-align: center;
    color: #8b8e98;
    margin-top: 20px;
  }
`;
