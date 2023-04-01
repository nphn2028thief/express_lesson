import { ObjectId } from 'mongoose';

enum EMediaType {
  'tv' = 'tv',
  'movie' = 'movie',
}

export interface IFavorite {
  accountId: ObjectId;
  displayName: string;
  mediaType: EMediaType;
  mediaId: string;
  mediaTitle: string;
  mediaPoster: string;
  mediaRate: number;
}

export interface IReview extends Omit<IFavorite, 'mediaRate'> {
  content: string;
}
