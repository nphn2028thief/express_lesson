import { RowDataPacket } from 'mysql2';

export interface IUser extends RowDataPacket {
  id: string;
  username: string;
  password: string;
  role: string;
}

export interface IUserProfile extends RowDataPacket {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  userId: string;
  roleId: string;
}

export interface ITokenInfo extends RowDataPacket {
  id: string;
  username: string;
  password: string;
  fullName: string;
  address: string;
  userId: string;
  refreshToken: string;
}
