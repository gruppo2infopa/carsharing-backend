import { DataTypes, Model, Optional } from 'sequelize';
import { DbConfig } from '../../config/db.config';
import { DriverLicenseType } from '../../models/driver-license.model';
import { Requirement } from '../../models/vehicle.model';

interface VehicleAttr {
  id?: number;
  type: string;
}

class VehicleModel extends Model<VehicleAttr> implements VehicleAttr {
  public id!: number;
  public type!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

VehicleModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: 'Vehicles', sequelize: DbConfig.getInstance() }
);

export { VehicleModel };
