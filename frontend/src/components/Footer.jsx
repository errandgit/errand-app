import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import Box from '@cloudscape-design/components/box';
import Grid from '@cloudscape-design/components/grid';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Container from '@cloudscape-design/components/container';

const Footer = () => {
  const linkStyle = {
    color: 'inherit',
    textDecoration: 'none',
    display: 'block',
    padding: '4px 0'
  };
  
  return (
    <Box backgroundColor="dark" color="text-body-secondary" padding="xxl">
      <Container>
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 6, m: 3 } },
            { colspan: { default: 12, s: 6, m: 3 } },
            { colspan: { default: 12, s: 6, m: 3 } },
            { colspan: { default: 12, s: 6, m: 3 } }
          ]}
        >
          <Box padding="s">
            <SpaceBetween size="l">
              <Box variant="h2" color="text-label" fontSize="heading-l">Errand</Box>
              <Box variant="p">Connecting people with local service professionals</Box>
            </SpaceBetween>
          </Box>
          
          <Box padding="s">
            <SpaceBetween size="m">
              <Box variant="h3" color="text-label">Services</Box>
              <SpaceBetween size="xs">
                <Link to="/services/home-improvement" style={linkStyle}>Home Improvement</Link>
                <Link to="/services/cleaning" style={linkStyle}>Cleaning</Link>
                <Link to="/services/moving" style={linkStyle}>Moving</Link>
                <Link to="/services/personal" style={linkStyle}>Personal</Link>
                <Link to="/services/tech" style={linkStyle}>Tech</Link>
              </SpaceBetween>
            </SpaceBetween>
          </Box>
          
          <Box padding="s">
            <SpaceBetween size="m">
              <Box variant="h3" color="text-label">Company</Box>
              <SpaceBetween size="xs">
                <Link to="/about" style={linkStyle}>About</Link>
                <Link to="/careers" style={linkStyle}>Careers</Link>
                <Link to="/press" style={linkStyle}>Press</Link>
                <Link to="/blog" style={linkStyle}>Blog</Link>
                <Link to="/contact" style={linkStyle}>Contact</Link>
              </SpaceBetween>
            </SpaceBetween>
          </Box>
          
          <Box padding="s">
            <SpaceBetween size="m">
              <Box variant="h3" color="text-label">Legal</Box>
              <SpaceBetween size="xs">
                <Link to="/terms" style={linkStyle}>Terms of Service</Link>
                <Link to="/privacy" style={linkStyle}>Privacy Policy</Link>
                <Link to="/guidelines" style={linkStyle}>Community Guidelines</Link>
                <Link to="/copyright" style={linkStyle}>Copyright</Link>
              </SpaceBetween>
            </SpaceBetween>
          </Box>
        </Grid>
        
        <Box padding={{ top: "xl" }} textAlign="center">
          <Box variant="p">&copy; {new Date().getFullYear()} Errand. All rights reserved.</Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;