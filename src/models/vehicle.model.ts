import { DriverLicenseType } from './driver-license.model';

abstract class Vehicle {
  constructor(public id: number) {}

  public abstract getRequirement(): Requirement;
}

class Car extends Vehicle {
  constructor(
    id: number,
    public licensePlate: string,
    public autonomy: number,
    public seats: number,
    public displacement: number
  ) {
    super(id);
  }

  public getRequirement(): Requirement {
    // TODO: cambiare con i valori corretti
    if (this.displacement > 55.0)
      return { minimumAge: 21, driverLicenseType: DriverLicenseType.B };
    else return { minimumAge: 18, driverLicenseType: DriverLicenseType.B };
  }
}

class ElectricalScooter extends Vehicle {
  constructor(id: number, public autonomy: number) {
    super(id);
  }

  public getRequirement(): Requirement {
    // TODO: cambiare con i valori corretti
    return { minimumAge: 21, driverLicenseType: null };
  }
}

class Motorbike extends Vehicle {
  constructor(
    id: number,
    public licensePlate: string,
    public autonomy: number,
    public displacement: number
  ) {
    super(id);
  }

  public getRequirement(): Requirement {
    // TODO: cambiare con i valori corretti
    return { minimumAge: 21, driverLicenseType: DriverLicenseType.A };
  }
}

class Bike extends Vehicle {
  constructor(id: number) {
    super(id);
  }

  public getRequirement(): Requirement {
    // TODO: cambiare con i valori corretti
    return { minimumAge: 21, driverLicenseType: DriverLicenseType.A2 };
  }
}

interface Requirement {
  minimumAge: number;
  driverLicenseType: DriverLicenseType | null;
}

export { Vehicle, Car, ElectricalScooter, Motorbike, Bike, Requirement };
