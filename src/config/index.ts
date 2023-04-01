import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL || '',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
  tmdbBaseUrl: process.env.TMDB_BASE_URL,
  tmdbKey: process.env.TMDB_KEY,
  mailEmail: process.env.MAIL_EMAIL || '',
  mailPassword: process.env.MAIL_PASSWORD || '',
};

export default config;
