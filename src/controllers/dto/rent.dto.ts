export class UpdateRentDto {
  problemDescription: string;
  expectedEndDate: Date;
  newFinalDestination?: string;
  bookingId: number;
}

export class RentDto {
  vehicleUrl: string;
  unlockCode?: string;
  bookingId: number;
}

export class RentResponseDto {
  latePayment?: number;
}
