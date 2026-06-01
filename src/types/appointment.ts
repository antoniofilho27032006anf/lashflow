export interface IAppointment {
  _id: string;
  userId: string;
  serviceId: string;
  date: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELED";
}