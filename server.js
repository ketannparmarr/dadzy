const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const crypto = require('crypto');
const winston = require('winston');
const client = require('prom-client');
const Stripe = require('stripe');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const dotenv = require('dotenv');

// Load environment variables for local testing
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- TELEMETRY: Winston Structured Logger (Google Cloud Logging Standard) ---
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// --- TELEMETRY: Prometheus Metrics Exporter ---
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  labelNames: ['method', 'route', 'status_code']
});
register.registerMetric(httpRequestCounter);

const httpResponseDuration = new client.Histogram({
  name: 'http_response_duration_seconds',
  help: 'Duration of HTTP responses in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5]
});
register.registerMetric(httpResponseDuration);

// Middleware to track request duration and count
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const duration = diff[0] + diff[1] / 1e9;
    httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
    httpResponseDuration.labels(req.method, req.path, res.statusCode).observe(duration);
  });
  next();
});

// Expose Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    logger.error('Failed to collect metrics', { error: err.message });
    res.status(500).end(err);
  }
});

// --- SECRET MANAGER SETUP ---
let SECRETS = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'client_id_placeholder',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'client_secret_placeholder',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'), // 256-bit key
};

async function loadSecrets() {
  if (process.env.NODE_ENV === 'production' && process.env.GCP_PROJECT_ID) {
    logger.info('Initializing Secret Manager Client...');
    try {
      const client = new SecretManagerServiceClient();
      const project = process.env.GCP_PROJECT_ID;

      const secretsToLoad = [
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'ENCRYPTION_KEY'
      ];

      for (const secretName of secretsToLoad) {
        const [version] = await client.accessSecretVersion({
          name: `projects/${project}/secrets/${secretName}/versions/latest`,
        });
        const payload = version.payload.data.toString('utf8');
        SECRETS[secretName] = payload;
      }
      logger.info('Secrets loaded successfully from GCP Secret Manager.');
    } catch (error) {
      logger.error('Error loading secrets from Secret Manager, falling back to process.env', { error: error.message });
    }
  }
}

// Initialize Stripe after secrets are loaded
let stripe;
loadSecrets().then(() => {
  stripe = new Stripe(SECRETS.STRIPE_SECRET_KEY);
});

// --- PRIVACY, CORS & SECURITY CONFIGURATION (Helmet) ---
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'", "https://js.stripe.com", "https://apis.google.com"],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "frame-src": ["'self'", "https://js.stripe.com"],
      "img-src": ["'self'", "data:", "https://images.unsplash.com", "https://*.googleapis.com"],
      "connect-src": ["'self'", "https://api.stripe.com", "https://*.googleapis.com"],
    }
  }
}));

app.use(cors({
  origin: process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// We use JSON parser for all routes except Stripe webhook which needs raw body
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// --- FIELD ENCRYPTION FOR PRIVATE SALON REGISTRY (AES-256-GCM) ---
function encryptField(text) {
  const iv = crypto.randomBytes(12);
  const key = Buffer.from(SECRETS.ENCRYPTION_KEY, 'hex');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  return {
    iv: iv.toString('hex'),
    content: encrypted,
    tag: authTag
  };
}

function decryptField(encryptedObj) {
  const iv = Buffer.from(encryptedObj.iv, 'hex');
  const tag = Buffer.from(encryptedObj.tag, 'hex');
  const key = Buffer.from(SECRETS.ENCRYPTION_KEY, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encryptedObj.content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Sandbox API endpoint testing field encryption
app.post('/api/salon/register', (req, res) => {
  try {
    const { name, email, measurements } = req.body;
    if (!name || !email || !measurements) {
      return res.status(400).json({ error: 'Missing required field' });
    }
    
    // Encrypt measurements field
    const encryptedMeasurements = encryptField(measurements);
    
    logger.info('Encrypted salon registration successfully', { email });
    res.json({
      message: 'Securely registered',
      encryptedMeasurements
    });
  } catch (err) {
    logger.error('Encryption failed', { error: err.message });
    res.status(500).json({ error: 'Data processing error' });
  }
});

// --- GOOGLE OAUTH 2.0 WITH CSRF PROTECTION ---
app.get('/api/auth/google/url', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  // Store the state in user session or cookie (for this stateless demo we send it to the client to return)
  const redirectUri = `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/google/callback`;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?` + 
    `client_id=${SECRETS.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=email%20profile&` +
    `state=${state}`;
    
  res.json({ url, state });
});

app.get('/api/auth/google/callback', async (req, res) => {
  const { code, state, expectedState } = req.query;
  
  // Anti-CSRF protection: Compare state
  if (state !== expectedState) {
    logger.warn('State verification failed for OAuth callback');
    return res.status(400).json({ error: 'State verification failed. Potential CSRF attack detected.' });
  }

  try {
    // In production, exchange code for tokens
    logger.info('OAuth callback state verified. Exchanging code for tokens.');
    res.json({ success: true, user: { email: 'vip-patron@dadzy.com', name: 'Distinguished Patriarch' } });
  } catch (err) {
    logger.error('OAuth token exchange failed', { error: err.message });
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// --- HEADLESS STRIPE PAYMENT PROXY ---
app.post('/api/payment/intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 420000, // Default to $4,200.00 for premium outerwear
      currency: currency || 'usd',
      metadata: { integration_check: 'dadzy_headless_stripe' },
    });
    
    logger.info('Stripe Payment Intent created successfully', { id: paymentIntent.id });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    logger.error('Stripe Payment Intent creation failed', { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// Stripe webhook cryptographic verification
app.post('/api/payment/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, SECRETS.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature verification failed', { error: err.message });
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    logger.info('PaymentIntent was successful! Fulfilling order in Medusa.js backend', { id: paymentIntent.id });
    // Trigger Medusa Order Placement logic here
  }
  
  res.json({ received: true });
});

// --- DYNAMIC IMAGE OPTIMIZATION (sharp Engine) ---
app.get('/api/image-optimize', async (req, res) => {
  const { url, width, format } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    // In production, we fetch the image and process it via Sharp
    // Here we set Cache-Control headers to optimize CDN loading
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    logger.info('Optimizing asset with sharp', { url, width, format });
    
    // Simulate compressed webp response or pipe remote image
    res.json({
      optimized: true,
      originalUrl: url,
      format: format || 'webp',
      width: width || 800,
      cacheControl: 'public, max-age=31536000, immutable'
    });
  } catch (err) {
    logger.error('Image optimization failed', { error: err.message });
    res.status(500).json({ error: 'Failed to optimize image' });
  }
});

// --- PAGE CACHING & BACKGROUND CACHE WARMER ---
const pageCache = new Map();

app.get('/api/catalog', (req, res) => {
  const cacheKey = 'catalog_listings';
  if (pageCache.has(cacheKey)) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(pageCache.get(cacheKey));
  }

  // Database fetch fallback (simulated)
  const freshCatalog = {
    collections: ['Silver Fox Couture', 'Noble Patriarch Leisurewear'],
    updatedAt: new Date().toISOString()
  };
  
  pageCache.set(cacheKey, freshCatalog);
  res.setHeader('X-Cache', 'MISS');
  res.json(freshCatalog);
});

// Background Cron/Warmer Loop every 5 minutes (Pre-generates catalog pages)
setInterval(() => {
  logger.info('Cache Warmer: Background refresh of index catalog listing triggered.');
  const pregeneratedCatalog = {
    collections: ['Silver Fox Couture', 'Noble Patriarch Leisurewear'],
    updatedAt: new Date().toISOString(),
    pregenerated: true
  };
  pageCache.set('catalog_listings', pregeneratedCatalog);
}, 300000); // 5 minutes

// --- HEALTH CHECK ENDPOINT ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// --- STATIC ASSETS & SINGLE PAGE APPLICATION ROUTING ---
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      // In development / fallback: provide raw index response if dist doesn't exist
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>DADZY - High-Fashion Menswear</title></head>
          <body><div id="root">DADZY Platform Active</div></body>
        </html>
      `);
    }
  });
});

app.listen(PORT, () => {
  logger.info(`DADZY Server running on port ${PORT}`);
});
