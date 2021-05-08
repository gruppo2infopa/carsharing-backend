class DriverLicense {
  constructor(
    public id: string,
    public issueDate: Date,
    public expiryDate: Date,
    public img: string, //path of the image
    public categories: DriverLicenseType[]
  ) {}
}

enum DriverLicenseType {
  AM,
  A1,
  A2,
  A,
  B,
}

export { DriverLicense, DriverLicenseType };
