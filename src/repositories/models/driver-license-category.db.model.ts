import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db.config';
import { DriverLicenseType } from '../../models/driver-license.model';

class DriverLicenseCategoryModel extends Model<{
  category: DriverLicenseType;
}> {
  public category!: DriverLicenseType;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
