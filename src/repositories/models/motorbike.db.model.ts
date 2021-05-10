import { DataTypes, Model, Optional } from 'sequelize';
import { DbConfig } from '../../config/db.config';
import { VehicleModel } from './vehicle.db.model';

export interface MotorbikeAttr {
  id: number;
  licensePlate: string;
  autonomy: number;
  displacement: number;
}

class MotorbikeModel extends Model<MotorbikeAttr> implements MotorbikeAttr {
  public id!: number;
  public licensePlate!: string;
  public autonomy!: number;
  public displacement!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MotorbikeModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    autonomy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    displacement: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  { tableName: 'Motorbikes', sequelize: DbConfig.getInstance() }
);

MotorbikeModel.belongsTo(VehicleModel, {
  foreignKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export { MotorbikeModel };
