import { DataTypes, Model } from 'sequelize';
import { DbConfig } from '../../config/db.config';
import {
  DriverLicense,
  DriverLicenseType,
} from '../../models/driver-license.model';
import { DriverLicenseCategoryModel } from './driver-license-category.db.model';

class DriverLicenseModel extends Model<DriverLicense> implements DriverLicense {
  public id!: string;
  public issueDate!: Date;
  public expiryDate!: Date;
  public img!: string;
  public categories!: DriverLicenseType[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DriverLicenseModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categories: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: 'DriverLicences', sequelize: DbConfig.getInstance() }
);

DriverLicenseModel.hasMany(DriverLicenseCategoryModel, {
  foreignKey: 'driverLicenseId',
});

export { DriverLicenseModel };
