import app from '../index';

export const csp = {
  directives: {
    defaultSrc: [
      "'self'",
      'https://*.ohmpiromrak.com',
      'https://*.ohmpiromrak.com:443',
    ],
    connectSrc: [
      "'self'",
      'https://*.ohmpiromrak.com',
      'https://*.ohmpiromrak.com:443',
    ],
    fontSrc: [
      "'self'",
      'data:',
      'https://fonts.googleapis.com',
      'https://*.ohmpiromrak.com',
      'https://*.ohmpiromrak.com:443',
    ],
    scriptSrc: [
      "'self'",
      'about:',
      'https://*.ohmpiromrak.com',
      'https://*.ohmpiromrak.com:443',
      'https://ajax.cloudflare.com',
    ],
    styleSrc: [
      "'self'",
      'https:',
      'data:',
      "'unsafe-inline'",
      'https://*.ohmpiromrak.com',
      'https://*.ohmpiromrak.com:443',
    ],
    imgSrc: [
      "'self'",
      'blob:',
      'data:',
      'https:',
      'https://*.ohmpiromrak.com',
      'https://*.ohmpiromrak.com:443',
    ],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    frameSrc: ["'none'"],
    manifestSrc: ["'self'"],
    objectSrc: ["'self'", 'https://*.ohmpiromrak.com'],
  },
};

export const featurePolicy = {
  features: {
    payment: ["'none'"],
    microphone: ["'none'"],
    camera: ["'none'"],
  },
};
export const referrerPolicy = { policy: 'no-referrer-when-downgrade' };
