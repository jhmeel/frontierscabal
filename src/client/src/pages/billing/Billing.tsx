import React, { useState } from 'react';
import styled from 'styled-components';
import { Box, Card, CardContent, Typography, Button, Grid, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import { PaystackButton } from 'react-paystack';
import { Navigate, useNavigate } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const PlanTitle = styled(Typography)`
  font-weight: bold;
  margin-bottom: 16px;
`;

const PlanPrice = styled(Typography)`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 16px;
`;

const PlanDescription = styled(Typography)`
  margin-bottom: 24px;
`;

const FeatureList = styled(Box)`
  margin-bottom: 24px;
`;

const Feature = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const FeatureText = styled(Typography)<{ included: boolean }>`
  margin-left: 8px;
  color: ${({ included }) => (included ? 'inherit' : '#999')};
`;

const DiscountChip = styled(Box)`
  background-color: #ff4081;
  color: #fff;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 16px;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
`;

const GreenCheckCircleIcon = styled(CheckCircleIcon)`
  color: #4caf50;
`;

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  title: string;
  price: string;
  description: string;
  features: PlanFeature[];
  discount: string | null;
}

const plans: Plan[] = [
  {
    title: 'Free Plan',
    price: '₦0',
    description: 'Basic access to our platform',
    features: [
      { text: 'Access to blog', included: true },
      { text: 'Real-time messaging with peers', included: true },
      { text: 'Personalized content', included: true },
      { text: 'Limited study materials to download', included: true },
      { text: 'Ad-supported experience', included: true },
      { text: 'AI-powered blog support', included: false },
      { text: 'Unlimited study materials', included: false },
    ],
    discount: null,
  },
  {
    title: 'Weekly Plan',
    price: '₦1,250',
    description: 'Full access for 7 days',
    features: [
      { text: 'All Free Plan features', included: true },
      { text: 'AI-powered blog support', included: true },
      { text: 'Unlimited study materials', included: true },
      { text: 'Ad-free experience', included: true },
    ],
    discount: null,
  },
  {
    title: 'Monthly Plan',
    price: '₦4,500',
    description: 'Full access for 30 days',
    features: [
      { text: 'All Weekly Plan features', included: true },
      { text: 'Priority support', included: true },
      { text: 'Exclusive webinars', included: true },
    ],
    discount: '22% off compared to weekly',
  },
  {
    title: 'Annual Plan',
    price: '₦24,500',
    description: 'Full access for 365 days',
    features: [
      { text: 'All Monthly Plan features', included: true },
      { text: 'Early access to new features', included: true },
      { text: 'Personal learning coach', included: true },
    ],
    discount: '17% off compared to monthly',
  },
];

const PricingCard: React.FC<{ plan: Plan; componentProps: (plan: Plan) => any }> = ({
  plan,
  componentProps,
}) => {

  const navigate = useNavigate(); 

  const handleGetStartedClick = () => {
    navigate('/profile'); 
  };
  return( <StyledCard>
    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <PlanTitle variant="h5">{plan.title}</PlanTitle>
      <PlanPrice variant="h4">{plan.price}</PlanPrice>
      {plan.discount && <DiscountChip>{plan.discount}</DiscountChip>}
      <PlanDescription variant="body2" color="textSecondary">
        {plan.description}
      </PlanDescription>
      <FeatureList>
        {plan.features.map((feature, idx) => (
          <Feature key={idx}>
            {feature.included ? (
              <GreenCheckCircleIcon fontSize="small" />
            ) : (
              <CancelIcon color="error" fontSize="small" />
            )}
            <FeatureText variant="body2" included={feature.included}>
              {feature.text}
            </FeatureText>
          </Feature>
        ))}
      </FeatureList>
      <Box sx={{ marginTop: 'auto' }}>
        {plan.title === 'Free Plan' ? (
          <Button variant="contained" color="primary" fullWidth onClick={handleGetStartedClick}>
            Get Started
          </Button>
        ) : (
          <Button variant="contained" color="primary" fullWidth>  <PaystackButton className='pay-btn' {...componentProps(plan)} /></Button>
      
        )}
      </Box>
    </CardContent>
  </StyledCard>
)
}


 

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);

  const handleClose = () => {
    navigate('/profile');
  };

  const publicKey = 'pk_live_e01be7df03cfd763e978d68adc9bc2dbd9867a6e';

  const handlePaystackSuccessAction = (reference: any) => {
    toast.success('Payment successful!');
  };

  const handlePaystackCloseAction = () => {
    toast.error('Payment canceled');
  };

  const componentProps = (plan: Plan) => {
    return {
      email:user?.email,
      amount: parseInt(plan.price.replace('₦', '').replace(',', '')) * 100,
      publicKey,
      text: 'Subscribe Now',
      onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
      onClose: handlePaystackCloseAction,
    };
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, padding: 4, backgroundColor: '#f5f5f5', position: 'relative' }}>
        <CloseButton onClick={handleClose} aria-label="close">
          <CloseIcon />
        </CloseButton>
        <Typography variant="h2" align="center" gutterBottom>
          Choose Your Plan
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Unlock your potential with our tailored pricing options
        </Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
          {plans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <PricingCard plan={plan} componentProps={componentProps} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default Pricing;
