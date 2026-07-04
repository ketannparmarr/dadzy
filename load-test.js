import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 5000 },  // Ramp up to 5,000 users over 2 minutes
    { duration: '5m', target: 10000 }, // Ramp up to 10,000 users over 5 minutes
    { duration: '3m', target: 10000 }, // Stay at 10,000 users for 3 minutes (active drop peak)
    { duration: '2m', target: 0 },     // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests must complete under 500ms
    http_req_failed: ['rate<0.01'],    // Under 1% failure rate
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';

export default function () {
  // 1. Visit Landing Page / Catalog
  const catalogRes = http.get(`${BASE_URL}/api/catalog`);
  check(catalogRes, {
    'catalog status was 200': (r) => r.status === 200,
    'catalog was cached/fast': (r) => r.timings.duration < 200,
  });
  sleep(1);

  // 2. Fetch high-res optimized collection asset
  const imageRes = http.get(`${BASE_URL}/api/image-optimize?url=https://images.unsplash.com/photo-1507679799987-c73779587ccf&width=800`);
  check(imageRes, {
    'image optimization works': (r) => r.status === 200,
  });
  sleep(1);

  // 3. Register for Private Salon
  const payload = JSON.stringify({
    name: 'Distinguished Patron',
    email: `patron_${__VU}_${__ITER}@dadzy.com`,
    measurements: 'Chest: 42, Waist: 36, Inseam: 31',
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const registerRes = http.post(`${BASE_URL}/api/salon/register`, payload, params);
  check(registerRes, {
    'salon registration successful': (r) => r.status === 200,
  });
  sleep(2);

  // 4. Create Payment Intent (Simulating Stripe checkout initiation)
  const paymentPayload = JSON.stringify({
    amount: 420000, // $4,200.00
    currency: 'usd',
  });
  const paymentRes = http.post(`${BASE_URL}/api/payment/intent`, paymentPayload, params);
  check(paymentRes, {
    'payment intent successful': (r) => r.status === 200,
  });
  sleep(1);
}
