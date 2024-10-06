import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Skeleton,
  Tabs,
  Tab,
  Box,
  Link
} from '@mui/material';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StyledCardContent = styled(CardContent)`
  flex-grow: 1;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

interface EducationalContent {
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const NASA: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [earthData, setEarthData] = useState<EducationalContent[]>([]);
  const [climateData, setClimateData] = useState<EducationalContent[]>([]);
  const [weatherData, setWeatherData] = useState<EducationalContent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [earthResponse, climateResponse, weatherResponse] = await Promise.all([
          axios.get('https://images-api.nasa.gov/search?q=earth&media_type=image'),
          axios.get('https://images-api.nasa.gov/search?q=climate%20change&media_type=image'),
          axios.get('https://images-api.nasa.gov/search?q=weather&media_type=image')
        ]);

        const processData = (response: any): EducationalContent[] => 
          response.data.collection.items.slice(0, 6).map((item: any) => ({
            title: item.data[0].title,
            description: item.data[0].description,
            imageUrl: item.links?.[0]?.href,
            link: `https://images.nasa.gov/details-${item.data[0].nasa_id}`
          }));

        setEarthData(processData(earthResponse));
        setClimateData(processData(climateResponse));
        setWeatherData(processData(weatherResponse));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data from NASA API:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderContent = (data: EducationalContent[]) => (
    <Grid container spacing={3}>
      {data.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <StyledCard>
            {item.imageUrl && (
              <StyledImage src={item.imageUrl} alt={item.title} />
            )}
            <StyledCardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description.length > 100
                  ? `${item.description.substring(0, 100)}...`
                  : item.description}
              </Typography>
              {item.link && (
                <Link href={item.link} target="_blank" rel="noopener noreferrer">
                  Learn More
                </Link>
              )}
            </StyledCardContent>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container maxWidth="lg">
   
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Earth" />
        <Tab label="Climate" />
        <Tab label="Weather" />
      </Tabs>
      {loading ? (
        <Grid container spacing={3}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard>
                <Skeleton variant="rectangular" height={200} />
                <StyledCardContent>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={20} count={3} />
                </StyledCardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <TabPanel value={activeTab} index={0}>
            {renderContent(earthData)}
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            {renderContent(climateData)}
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            {renderContent(weatherData)}
          </TabPanel>
        </>
      )}
    </Container>
  );
};

export default NASA;