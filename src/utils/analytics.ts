import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 measurement ID

// Initialize GA4 with better error handling
export const initGA = () => {
  try {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      testMode: process.env.NODE_ENV !== 'production',
      debug: process.env.NODE_ENV !== 'production',
    });
    console.log('Google Analytics initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Google Analytics:', error);
  }
};

// Track page views with error handling
export const trackPageView = (path: string) => {
  try {
    ReactGA.send({ 
      hitType: "pageview", 
      page: path,
      title: document.title
    });
    console.log('Page view tracked:', path);
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

// Enhanced event tracking with more parameters
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
  nonInteraction?: boolean
) => {
  try {
    ReactGA.event({
      category,
      action,
      label,
      value,
      nonInteraction
    });
    console.log('Event tracked:', { category, action, label, value });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

// Track user timing
export const trackTiming = (
  category: string,
  variable: string,
  value: number,
  label?: string
) => {
  try {
    ReactGA.timing({
      category,
      variable,
      value,
      label
    });
  } catch (error) {
    console.error('Failed to track timing:', error);
  }
};

// Track exceptions
export const trackException = (description: string, fatal: boolean = false) => {
  try {
    ReactGA.exception({
      description,
      fatal
    });
  } catch (error) {
    console.error('Failed to track exception:', error);
  }
};