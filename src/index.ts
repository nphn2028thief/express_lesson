import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

declare global {
  namespace Express {
    interface Request {
      accountId?: string;
    }
  }
}

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.use('/api/v1', routes());

app.listen(process.env.PORT, () => {
  console.log(`Server app listening on port ${process.env.PORT}`);
});
