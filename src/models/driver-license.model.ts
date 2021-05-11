import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class DriverLicense {
  @PrimaryColumn()
  id: string;

  @Column()
  issueDate: Date;

  @Column()
  expiryDate: Date;

  @Column()
  img: string; //path of the image

  @Column('text')
  @ManyToMany(() => DriverLicenseType)
  categories: DriverLicenseType[];
}

@Entity()
export class DriverLicenseType {
  public static readonly AM: DriverLicenseType = new DriverLicenseType('AM');
  public static readonly A1: DriverLicenseType = new DriverLicenseType('A1');
  public static readonly A2: DriverLicenseType = new DriverLicenseType('A2');
  public static readonly A: DriverLicenseType = new DriverLicenseType('A');
  public static readonly B: DriverLicenseType = new DriverLicenseType('B');

  @PrimaryColumn()
  name: string;

  private constructor(name: string) {
    this.name = name;
  }
}
