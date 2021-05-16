export class UpdateRentDto {
  problemDescription: string;
  expectedEndDate: Date;
  newFinalDestination?: string;
}

export class RentDto {
  unlockCode?: string;
  bookingId: number;
}

export class RentResponseDto {
  latePayment?: number;
}
