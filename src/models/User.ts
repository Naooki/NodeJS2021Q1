import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface UserAttributes {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

// TODO: Delegate ID generation logic to the Data Source
export interface UserCreationAttributes
  extends Optional<UserAttributes, 'isDeleted'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> {}

export const InitUserModel = (sequelize: Sequelize) =>
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      login: DataTypes.TEXT,
      password: DataTypes.TEXT,
      age: DataTypes.INTEGER,
      isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { sequelize },
  );
