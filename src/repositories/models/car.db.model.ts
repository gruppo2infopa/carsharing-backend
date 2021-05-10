import { DataTypes, Model, Optional } from 'sequelize';
import { DbConfig } from '../../config/db.config';
import { DriverLicenseType } from '../../models/driver-license.model';
import { Car } from '../../models/vehicle.model';
// import { Car, Requirement, Vehicle } from '../../models/vehicle.model';
import { VehicleModel } from './vehicle.db.model';

export interface CarAttr {
  id: number;
  autonomy: number;
  displacement: number;
  licensePlate: string;
  seats: number;
}

class CarModel extends Model<CarAttr> implements CarAttr {
  public id!: number;
  public autonomy!: number;
  public displacement!: number;
  public licensePlate!: string;
  public seats!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CarModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    autonomy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    displacement: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { tableName: 'Cars', sequelize: DbConfig.getInstance() }
);

CarModel.belongsTo(VehicleModel, {
  foreignKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export { CarModel };
