import mongoose from 'mongoose';

const Schema = mongoose.Schema;

interface IAccount {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  image?: string;
  favorites: number[];
  reviews: mongoose.Types.ObjectId[];
  createAt: Date;
  updateAt: Date;
}

const accountSchema = new Schema<IAccount>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  image: { type: String, default: '' },
  favorites: [{ type: Number, require: true }],
  reviews: [{ type: mongoose.Types.ObjectId, ref: 'Review', require: true }],
  createAt: { type: Date, default: Date.now() },
  updateAt: { type: Date, default: Date.now() },
});

export default mongoose.model<IAccount>('Account', accountSchema);
