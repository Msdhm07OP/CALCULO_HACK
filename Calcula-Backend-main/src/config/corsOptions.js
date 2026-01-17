// CORS configuration for the SIH Backend
const corsOptions = {
  // Allow requests from these origins
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Base defaults
    const defaultOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:5178',
      'http://localhost:8080',
      'https://localhost:3000',
      'https://localhost:5173',
    ];

    // Merge with Env var if exists
    const envOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
    const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`[CORS] Blocked request from origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS policy'));
    }
  },

  // Allow credentials (cookies, authorization headers)
  credentials: true,

  // Allow these methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  // Allow these headers
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token',
    'X-Refresh-Token'
  ],

  // Expose these headers to the client
  exposedHeaders: ['set-cookie'],

  // Enable preflight caching
  optionsSuccessStatus: 200,

  // Cache preflight response for 24 hours
  maxAge: 86400
};

export default corsOptions;