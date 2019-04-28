import app from '../index';

export const csp = {
  directives: {
    defaultSrc: [
      "'self'",
      'https://*.ohmpiromrak.com',
      'https://*.ohmpiromrak.com:443',
      'https://connect.facebook.net',
      'https://staticxx.facebook.com',
      'https://www.facebook.com',
      'https://web.facebook.com',
      'https://facebook.com',
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
      'https://fonts.gstatic.com',
      'https://use.fontawesome.com',
    ],
    scriptSrc: [
      "'self'",
      'about:',
      'https://*.ohmpiromrak.com',
      'https://*.ohmpiromrak.com:443',
      'https://ajax.cloudflare.com',
      'https://connect.facebook.net',
      'https://use.fontawesome.com',
    ],
    styleSrc: [
      "'self'",
      'https:',
      'data:',
      "'unsafe-inline'",
      'https://*.ohmpiromrak.com',
      'https://*.ohmpiromrak.com:443',
      'https://connect.facebook.net',
      'https://use.fontawesome.com',
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
