import mongoose from 'mongoose';
import { IReview } from '../../types/review_and_favorite';

const Schema = mongoose.Schema;

const reviewSchema = new Schema<IReview>({
  account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  mediaType: { type: String, enum: ['tv', 'movie'], required: true },
  mediaId: { type: Number, required: true },
  mediaTitle: { type: String, required: true },
  mediaPoster: { type: String, required: true },
  content: { type: String, required: true },
  createAt: { type: Date, default: Date.now() },
  updateAt: { type: Date, default: Date.now() },
});

export default mongoose.model<IReview>('Review', reviewSchema);
