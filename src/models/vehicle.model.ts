import { DriverLicenseType } from './driver-license.model';

abstract class Vehicle {
  id?: number;
  constructor() {}

  public abstract getRequirement(): Requirement;
}

class Car extends Vehicle {
  constructor(
    public licensePlate: string,
    public autonomy: number,
    public seats: number,
    public displacement: number
  ) {
    super();
  }

  public getRequirement(): Requirement {
    // TODO: cambiare con i valori corretti
    if (this.displacement > 55.0)
      return { minimumAge: 21, driverLicenseType: DriverLicenseType.B };
    else return { minimumAge: 18, driverLicenseType: DriverLicenseType.B };
  }
}

class ElectricalScooter extends Vehicle {
  constructor(public autonomy: number) {
    super();
  }

  public getRequirement(): Requirement {
    // TODO: cambiare con i valori corretti
    return { minimumAge: 21, driverLicenseType: null };
  }
}

class Motorbike extends Vehicle {
  constructor(
    public licensePlate: string,
    public autonomy: number,
    public displacement: number
  ) {
    super();
  }

  public getRequirement(): Requirement {
    // TODO: cambiare con i valori corretti
    return { minimumAge: 21, driverLicenseType: DriverLicenseType.A };
  }
}

class Bike extends Vehicle {
  constructor() {
    super();
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
