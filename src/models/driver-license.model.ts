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
  AM = 'AM',
  A1 = 'A1',
  A2 = 'A2',
  A = 'A',
  B = 'B',
}

export { DriverLicense, DriverLicenseType };
