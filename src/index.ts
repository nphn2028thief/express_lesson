import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { connect } from './config/db';

declare global {
  namespace Express {
    interface Request {
      accountId: string;
    }
  }
}

dotenv.config();

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(cors());
app.use(morgan('tiny'));

app.use('/api/v1', routes());

// Connect to MongoDb
connect();

app.listen(process.env.PORT, () => {
  console.log(`Server app listening on port ${process.env.PORT}`);
});
