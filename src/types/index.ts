import { RowDataPacket } from 'mysql2';

export interface IAuth extends RowDataPacket {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  role: string;
  otpCode: string;
}

export interface IUserProfile extends RowDataPacket {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  accountId: string;
}

export interface IUser extends RowDataPacket {
  firstName: string;
  lastName: string;
  address: string;
  role: string;
}

export interface ITokenInfo extends RowDataPacket {
  id: string;
  username: string;
  password: string;
  fullName: string;
  address: string;
  accountId: string;
  refreshToken: string;
}

export interface ICourse extends RowDataPacket {
  id: string;
  name: string;
  description: string;
  image: string;
  level: string;
}
