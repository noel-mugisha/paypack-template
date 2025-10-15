// src/index.ts

import express from 'express';
import dotenv from 'dotenv';
import mainRouter from './routes';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies and capture raw body for webhook verification
app.use(
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.use('/api', mainRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});