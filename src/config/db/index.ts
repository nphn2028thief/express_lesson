import mongoose from 'mongoose';
import config from '../../config';

const connect = async () => {
  try {
    await mongoose.connect(config.databaseUrl);
    console.log('Connect Successfully!');
  } catch (error) {
    console.log('Connect Failure!', error);
    process.exit(1);
  }
};

export { connect };
