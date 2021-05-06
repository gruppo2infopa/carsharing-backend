import { Association, DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db.config';
import {
  DriverLicense,
  DriverLicenseType,
} from '../../models/driver-license.model';
import { DriverLicenseModel } from './driver-license.db.model';
import { UserModel } from './user.db.model';

class DriverLicenseCategoryModel extends Model<{
  category: DriverLicenseType;
}> {
  public category!: DriverLicenseType;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // public static assosiactions: {
  //   driverLicense: Association<UserModel, DriverLicenseModel>;
  // };
}

DriverLicenseCategoryModel.init(
  {
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: 'Driver License Category', sequelize }
);

export { DriverLicenseCategoryModel };
