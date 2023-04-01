import { Types } from 'mongoose';

export interface IProduct {
  name: string;
  amount: number;
  image: string;
  modelImage: string;
  currentPrice: number;
  saleOff?: number;
  newPrice?: number;
  colors: Types.DocumentArray<IColor>;
  sizes: Types.DocumentArray<ISize>;
  slug: string;
  createAt: Date;
  updateAt: Date;
}

export interface IColor {
  name: string;
  createAt: Date;
  updateAt: Date;
}

export interface ISize {
  symbol?: string;
  measure?: string;
  createAt: Date;
  updateAt: Date;
}

// export interface IColorsOnProducts extends RowDataPacket {
//   productId: string;
//   colorId: string;
// }

// export interface ISizesOnProducts extends RowDataPacket {
//   productId: string;
//   sizeId: string;
// }

export * from './media';
