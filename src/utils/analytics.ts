import ReactGA from 'react-ga4';

// Initialize GA4
export const initGA = () => {
  ReactGA.initialize('G-XXXXXXXXXX'); // Replace with your actual GA4 measurement ID
};

// Track page views
export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Track events
export const trackEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category,
    action,
    label
  });
};