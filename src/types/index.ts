import { RowDataPacket } from 'mysql2';

export interface IUserTest extends RowDataPacket {
  id: string;
  name: string;
}

export interface ICourse extends RowDataPacket {
  id: string;
  name: string;
  description: string;
  image: string;
  level: string;
  userId: string;
}

export interface IAssocUserCourse extends RowDataPacket {
  id: string;
  userId: string;
  courseId: string;
}

export interface IUser {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
}

export interface ILoginInfo {
  username: string;
  password: string;
}

export interface IRegisterInfo extends ILoginInfo {
  firstName: string;
  lastName: string;
  address: string;
}
