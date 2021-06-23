export class CreateCreditCardDto {
  id: string;
  owner: string;
  expiryDate: Date;
  cvv: String;
  circuit: String;
}
