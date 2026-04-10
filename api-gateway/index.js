const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.get('/health', (req, res) => res.status(200).send('API Gateway Health OK'));

// Proxy settings
app.use('/users', createProxyMiddleware({ target: process.env.USER_SERVICE_URL || 'http://localhost:5001', changeOrigin: true }));
app.use('/appointments', createProxyMiddleware({ target: process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:5002', changeOrigin: true }));
app.use('/queue', createProxyMiddleware({ target: process.env.QUEUE_SERVICE_URL || 'http://localhost:5003', changeOrigin: true }));

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
