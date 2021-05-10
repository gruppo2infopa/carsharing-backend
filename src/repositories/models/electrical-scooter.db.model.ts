import { DataTypes, Model, Optional } from 'sequelize';
import { DbConfig } from '../../config/db.config';
import { ElectricalScooter } from '../../models/vehicle.model';
import { VehicleModel } from './vehicle.db.model';

export interface ElectricalScooterAttr {
    id: number;
    autonomy: number;
  }
  
  class ElectricalScooterModel extends Model<ElectricalScooterAttr> implements ElectricalScooterAttr{
    public id!: number;
    public autonomy!: number;
   
     public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }
  
  ElectricalScooterModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      autonomy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'ElectricalScooters', sequelize: DbConfig.getInstance() }
  );
  
  ElectricalScooterModel.belongsTo(VehicleModel, {
    foreignKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  
  export { ElectricalScooterModel };
  