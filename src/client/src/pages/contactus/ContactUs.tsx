import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  Divider 
} from "@mui/material";
import { 
  Send as SendIcon, 
  WhatsApp as WhatsAppIcon, 
  ContactSupport as ContactSupportIcon 
} from '@mui/icons-material';
import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [enquiry, setEnquiry] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");


  
  const handleSubmit = () => {
    if (!subject) {
      toast.error("Subject is required!");
      return;
    } else if (!enquiry || enquiry.length < 5) {
      toast.error("Please provide a valid enquiry!");
      return;
    }
    const url = `mailto:frontierscabal@gmail.com?subject=${subject}&body=${enquiry}`;
    window.open(url, "_blank");

    setSubject("");
    setEnquiry("");
  };


  const handleWhatsApp = () => {
    const url = `https://wa.me/${"+2348081434636"}`;
    window.open(url, "_blank");
  };

  return (
    <StyledContainer maxWidth="lg">
        <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ height: '100%', }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: 4,
              background: 'linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%)'
            }}>
              <Box textAlign="center" mb={4}>
                <ContactSupportIcon 
                  sx={{ 
                    fontSize: { xs: 60, md: 80 }, 
                    color: 'primary.main', 
                    mb: 2 
                  }} 
                />
                <Typography variant="h4" fontWeight={700} color="primary">
                  Get In Touch
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  We'd love to hear from you. Send us a message!
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Email"
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      type="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      variant="outlined"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Message"
                      variant="outlined"
                      multiline
                      rows={4}
                      value={enquiry}
                      onChange={(e) => setEnquiry(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<SendIcon />}
                      sx={{ 
                        py: 1.5, 
                        borderRadius: 2,
                        boxShadow: 3,
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: 6
                        }
                      }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>

              <Divider sx={{ my: 3 }}>
                <Typography color="text.secondary">OR</Typography>
              </Divider>

              <Button
                variant="outlined"
                color="success"
                fullWidth
                startIcon={<WhatsAppIcon />}
                onClick={handleWhatsApp}
                sx={{ 
                  py: 1.5, 
                  borderRadius: 2,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'rgba(76, 175, 80, 0.08)'
                  }
                }}
              >
                Message on WhatsApp
              </Button>
            </Paper>
          </Grid>
        </Grid>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
}));

export default ContactUs;