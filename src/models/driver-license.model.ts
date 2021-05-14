import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.model';

@Entity()
export class DriverLicense {
  @PrimaryColumn()
  id: string;

  @Column('date')
  issueDate: Date;

  @Column('date')
  expiryDate: Date;

  @Column()
  img: string; //path of the image

  @ManyToMany(() => DriverLicenseType, {
    cascade: true,
  })
  @JoinTable()
  categories: DriverLicenseType[];

  @OneToOne(() => User, (user) => user.driverLicense, {
    onDelete: 'CASCADE',
  })
  user: User;
}

@Entity()
export class DriverLicenseType {
  public static readonly AM: DriverLicenseType = new DriverLicenseType('AM');
  public static readonly A1: DriverLicenseType = new DriverLicenseType('A1');
  public static readonly A2: DriverLicenseType = new DriverLicenseType('A2');
  public static readonly A: DriverLicenseType = new DriverLicenseType('A');
  public static readonly B: DriverLicenseType = new DriverLicenseType('B');

  private constructor(name: string) {
    this.name = name;
  }

  public toJSON() {
    return `${this.name}`;
  }

  @PrimaryColumn()
  name: string;
}
