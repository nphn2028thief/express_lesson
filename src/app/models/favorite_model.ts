import mongoose from 'mongoose';
import { IFavorite } from '../../types/review_and_favorite';

const Schema = mongoose.Schema;

const favoriteSchema = new Schema<IFavorite>({
  account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  mediaType: { type: String, enum: ['tv', 'movie'], required: true },
  mediaId: { type: Number, required: true },
  mediaTitle: { type: String, required: true },
  mediaPoster: { type: String, required: true },
  mediaRate: { type: Number, required: true },
});

export default mongoose.model<IFavorite>('Favorite', favoriteSchema);
