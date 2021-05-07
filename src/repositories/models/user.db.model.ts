import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db.config';
import { User, UserRole } from '../../models/user.model';
import { DriverLicenseModel } from './driver-license.db.model';

interface UserCreationAttributes extends Optional<User, 'email'> {}

class UserModel extends Model<User, UserCreationAttributes> implements User {
  public id!: number; // TODO: delete field?
  public email!: string;
  public password!: string;
  public name!: string;
  public surname!: string;
  public phoneNumber!: string;
  public fiscalCode!: string;
  public birthDate!: Date;
  public userRole!: UserRole;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // public static assosiactions: {
  //   driverLicense: Association<UserModel, DriverLicenseModel>;
  // };
}

UserModel.init(
  {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fiscalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userRole: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: 'Users', sequelize }
);

UserModel.belongsTo(DriverLicenseModel);

export { UserModel };
