import { ObjectId } from 'mongoose';

enum EMediaType {
  'tv' = 'tv',
  'movie' = 'movie',
}

export interface IFavorite {
  account: ObjectId;
  // displayName: string;
  mediaType: EMediaType;
  mediaId: number;
  mediaTitle: string;
  mediaPoster: string;
  mediaRate: number;
  createAt: Date;
  updateAt: Date;
}

export interface IReview extends Omit<IFavorite, 'mediaRate'> {
  content: string;
}
