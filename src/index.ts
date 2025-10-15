import express from 'express';
import dotenv from 'dotenv';
import mainRouter from './routes'; 

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.use('/api', mainRouter);


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});