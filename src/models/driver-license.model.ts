interface DriverLicense {
  id: string;
  issueDate: Date;
  expiryDate: Date;
  img: string; //path of the image
  categories: DriverLicenseType[];
}

enum DriverLicenseType {
  AM,
  A1,
  A2,
  A,
  B,
}

export { DriverLicense, DriverLicenseType };
