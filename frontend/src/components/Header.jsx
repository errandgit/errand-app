import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import { applyMode, Mode } from '@cloudscape-design/global-styles';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Apply Cloudscape light mode
  React.useEffect(() => {
    applyMode(Mode.Light);
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="aws-console-header">
      <TopNavigation
        identity={{
          href: "/",
          title: "Errand",
          logo: {
            src: "data:image/svg+xml;utf8," + encodeURIComponent(`
              <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="24" fill="#232F3E"/>
                <path d="M8 6h24v2H8V6zm0 4h24v2H8v-2zm0 4h18v2H8v-2z" fill="#FF9900"/>
                <text x="34" y="18" fill="#FF9900" font-size="8" font-family="Arial">β</text>
              </svg>
            `),
            alt: "Errand Console"
          },
          onFollow: event => {
            event.preventDefault();
            navigate("/");
          }
        }}
        utilities={[
          {
            type: "button",
            iconName: "notification",
            title: "Notifications",
            ariaLabel: "Notifications",
            badge: true,
            onClick: () => console.log("Notifications clicked")
          },
          {
            type: "menu-dropdown",
            iconName: "settings",
            ariaLabel: "Settings",
            title: "Settings",
            items: [
              {
                id: "settings-general",
                text: "General preferences"
              },
              {
                id: "settings-notifications", 
                text: "Notification settings"
              },
              {
                id: "settings-privacy",
                text: "Privacy settings"
              }
            ],
            onItemClick: ({ detail }) => {
              console.log("Settings item clicked:", detail.id);
            }
          },
          {
            type: "menu-dropdown",
            iconName: "status-info",
            ariaLabel: "Help",
            title: "Support",
            items: [
              {
                id: "help-docs",
                text: "Documentation",
                href: "/docs",
                external: true,
                externalIconAriaLabel: " (opens in new tab)"
              },
              {
                id: "help-support",
                text: "Contact support"
              },
              {
                id: "help-feedback", 
                text: "Send feedback"
              }
            ]
          },
          user ? {
            type: "menu-dropdown",
            text: user.name || `${user.firstName} ${user.lastName}`,
            description: user.email,
            iconName: "user-profile",
            items: [
              { 
                id: "profile", 
                text: "Account settings",
                iconName: "settings"
              },
              { 
                id: "billing", 
                text: "Billing & payments",
                iconName: "credit-card"
              },
              { 
                id: "security", 
                text: "Security credentials",
                iconName: "security"
              },
              { type: "divider" },
              {
                id: "support-group",
                text: "Support",
                items: [
                  {
                    id: "documentation",
                    text: "User guide",
                    href: "/docs",
                    external: true,
                    externalIconAriaLabel: " (opens in new tab)"
                  },
                  { id: "support-center", text: "Support center" },
                  { id: "service-health", text: "Service health" }
                ]
              },
              { type: "divider" },
              { 
                id: "signout", 
                text: "Sign out",
                iconName: "unlocked"
              }
            ],
            onItemClick: ({ detail }) => {
              if (detail.id === 'profile') {
                navigate('/profile');
              } else if (detail.id === 'billing') {
                navigate('/profile?tab=billing');
              } else if (detail.id === 'security') {
                navigate('/profile?tab=security');
              } else if (detail.id === 'signout') {
                handleSignOut();
              }
            }
          } : {
            type: "button",
            text: "Sign in",
            variant: "primary-button",
            onClick: () => navigate("/login")
          }
        ].filter(Boolean)}
        i18nStrings={{
          searchIconAriaLabel: "Search",
          searchDismissIconAriaLabel: "Close search",
          overflowMenuTriggerText: "More",
          overflowMenuTitleText: "All",
          overflowMenuBackIconAriaLabel: "Back",
          overflowMenuDismissIconAriaLabel: "Close menu"
        }}
      />
    </div>
  );
};

export default Header;