import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { applyMode, Mode } from '@cloudscape-design/global-styles';
import AppLayout from '@cloudscape-design/components/app-layout';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import Header from './components/Header';
import Footer from './components/Footer';
import LocationBar from './components/LocationBar';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ProviderRegister from './pages/ProviderRegister';
import '@cloudscape-design/global-styles/index.css';

function App() {
  // Apply CloudScape light mode
  React.useEffect(() => {
    applyMode(Mode.Light);
  }, []);

  const [navigationOpen, setNavigationOpen] = React.useState(false);
  const [activeHref, setActiveHref] = React.useState(window.location.pathname);

  const navigationItems = [
    { 
      type: "link", 
      text: "Dashboard", 
      href: "/",
      info: <span>Overview</span>
    },
    { type: "divider" },
    {
      type: "section",
      text: "Services",
      items: [
        { type: "link", text: "Browse Services", href: "/services" },
        { type: "link", text: "My Bookings", href: "/profile?tab=bookings" },
        { type: "link", text: "Service History", href: "/profile?tab=history" },
      ]
    },
    {
      type: "section", 
      text: "Providers",
      items: [
        { type: "link", text: "Find Providers", href: "/services" },
        { type: "link", text: "Become a Provider", href: "/pro/register" },
        { type: "link", text: "Provider Dashboard", href: "/provider/dashboard" },
      ]
    },
    { type: "divider" },
    {
      type: "section",
      text: "Account",
      items: [
        { type: "link", text: "Profile Settings", href: "/profile" },
        { type: "link", text: "Billing", href: "/profile?tab=billing" },
        { type: "link", text: "Security", href: "/profile?tab=security" },
      ]
    },
    { type: "divider" },
    {
      type: "section",
      text: "Support",
      items: [
        { type: "link", text: "Help Center", href: "/help" },
        { type: "link", text: "Contact Support", href: "/support" },
        { type: "link", text: "Documentation", href: "/docs" },
      ]
    }
  ];

  React.useEffect(() => {
    setActiveHref(window.location.pathname);
  }, [window.location.pathname]);

  return (
    <div className="app">
      <Header />
      <LocationBar />
      <AppLayout
        navigation={
          <SideNavigation
            activeHref={activeHref}
            header={{ 
              href: "/", 
              text: "Errand Console",
              logo: {
                src: "data:image/svg+xml;utf8," + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="4" fill="#232F3E"/>
                    <path d="M6 8h12v1.5H6V8zm0 3h12v1.5H6V11zm0 3h9v1.5H6V14z" fill="#FF9900"/>
                    <circle cx="16" cy="16" r="2" fill="#FF9900"/>
                  </svg>
                `),
                alt: "Errand Console"
              }
            }}
            items={navigationItems}
            onFollow={event => {
              if (!event.detail.external) {
                event.preventDefault();
                setActiveHref(event.detail.href);
                window.history.pushState({}, '', event.detail.href);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }
            }}
          />
        }
        navigationOpen={navigationOpen}
        onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
        toolsHide={true}
        contentType="default"
        content={
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pro/register" element={<ProviderRegister />} />
          </Routes>
        }
        notifications={
          <div style={{ padding: '8px 16px', background: '#0073bb', color: 'white', fontSize: '14px' }}>
            🎉 New: Enhanced service matching algorithm now available
          </div>
        }
      />
    </div>
  );
}

export default App;